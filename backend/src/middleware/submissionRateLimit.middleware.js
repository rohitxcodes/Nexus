const RateLimitWindow = require("../models/rateLimitWindow.model");

const RATE_LIMITS = {
  burst: {
    maxRequests: 5,
    windowMs: 20_000,
  },
  longWindow: {
    maxRequests: 20,
    windowMs: 10 * 60_000,
  },
};

function getBucket(now, windowMs) {
  return Math.floor(now / windowMs);
}

function formatRetryAfter(ms) {
  if (ms < 1000) return "a moment";
  const secs = Math.ceil(ms / 1000);
  if (secs < 60) return `${secs} second${secs !== 1 ? "s" : ""}`;
  const mins = Math.ceil(secs / 60);
  return `${mins} minute${mins !== 1 ? "s" : ""}`;
}

async function checkWindow(userId, tier, windowMs, maxRequests) {
  const now = Date.now();
  const bucket = getBucket(now, windowMs);
  const key = `sub:${tier}:${userId}:${bucket}`;

  const windowResetMs = (bucket + 1) * windowMs - now;
  const expiresAt = new Date(now + windowResetMs + 5_000);

  const doc = await RateLimitWindow.findOneAndUpdate(
    { key },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  if (doc.count > maxRequests) {
    return {
      allowed: false,
      current: doc.count,
      limit: maxRequests,
      retryAfterMs: windowResetMs,
    };
  }

  return {
    allowed: true,
    current: doc.count,
    limit: maxRequests,
    retryAfterMs: 0,
  };
}

async function submissionRateLimit(req, res, next) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const burstResult = await checkWindow(
      userId,
      "burst",
      RATE_LIMITS.burst.windowMs,
      RATE_LIMITS.burst.maxRequests,
    );
    if (!burstResult.allowed) {
      const retryAfterSecs = Math.ceil(burstResult.retryAfterMs / 1000);
      res.set("Retry-After", String(retryAfterSecs));
      return res.status(429).json({
        message: `Rate limit exceeded. You've hit ${RATE_LIMITS.burst.maxRequests} submissions in 20 seconds. Try again in ${formatRetryAfter(burstResult.retryAfterMs)}.`,
        retryAfterMs: burstResult.retryAfterMs,
        tier: "burst",
        current: burstResult.current,
        limit: burstResult.limit,
      });
    }

    const longWindowResult = await checkWindow(
      userId,
      "long",
      RATE_LIMITS.longWindow.windowMs,
      RATE_LIMITS.longWindow.maxRequests,
    );
    if (!longWindowResult.allowed) {
      const retryAfterSecs = Math.ceil(longWindowResult.retryAfterMs / 1000);
      res.set("Retry-After", String(retryAfterSecs));
      return res.status(429).json({
        message: `Long-window limit reached. You've used ${RATE_LIMITS.longWindow.maxRequests} submissions in 10 minutes. Try again in ${formatRetryAfter(longWindowResult.retryAfterMs)}.`,
        retryAfterMs: longWindowResult.retryAfterMs,
        tier: "longWindow",
        current: longWindowResult.current,
        limit: longWindowResult.limit,
      });
    }

    req.rateLimit = {
      burst: {
        remaining: RATE_LIMITS.burst.maxRequests - burstResult.current,
        limit: RATE_LIMITS.burst.maxRequests,
      },
      longWindow: {
        remaining:
          RATE_LIMITS.longWindow.maxRequests - longWindowResult.current,
        limit: RATE_LIMITS.longWindow.maxRequests,
      },
    };

    res.set("X-RateLimit-Limit-20s", String(RATE_LIMITS.burst.maxRequests));
    res.set("X-RateLimit-Remaining-20s", String(req.rateLimit.burst.remaining));
    res.set(
      "X-RateLimit-Limit-10m",
      String(RATE_LIMITS.longWindow.maxRequests),
    );
    res.set(
      "X-RateLimit-Remaining-10m",
      String(req.rateLimit.longWindow.remaining),
    );

    return next();
  } catch (err) {
    console.error(
      "[submissionRateLimit] Rate limiter error, failing open:",
      err.message,
    );
    return next();
  }
}

module.exports = submissionRateLimit;
