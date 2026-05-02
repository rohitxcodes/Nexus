const RateLimitWindow = require("../models/rateLimitWindow.model");

const RATE_LIMITS = {
  cooldown: {
    minGapMs: 5_000,
    ttlMs: 10_000,
  },
  perMinute: {
    maxRequests: 5,
    windowMs: 60_000,
  },
  perHour: {
    maxRequests: 20,
    windowMs: 60 * 60_000,
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

async function checkCooldown(userId) {
  const now = Date.now();
  const key = `sub:cd:${userId}`;
  const { minGapMs, ttlMs } = RATE_LIMITS.cooldown;

  const existing = await RateLimitWindow.findOne({ key })
    .select("lastTs")
    .lean();

  if (existing?.lastTs) {
    const elapsed = now - existing.lastTs;
    if (elapsed < minGapMs) {
      return { allowed: false, retryAfterMs: minGapMs - elapsed };
    }
  }

  await RateLimitWindow.findOneAndUpdate(
    { key },
    {
      $set: {
        lastTs: now,
        expiresAt: new Date(now + ttlMs),
      },
    },
    { upsert: true },
  );

  return { allowed: true, retryAfterMs: 0 };
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
    const cooldownResult = await checkCooldown(userId);
    if (!cooldownResult.allowed) {
      const retryAfterSecs = Math.ceil(cooldownResult.retryAfterMs / 1000);
      res.set("Retry-After", String(retryAfterSecs));
      return res.status(429).json({
        message: `Slow down. Wait ${formatRetryAfter(cooldownResult.retryAfterMs)} before your next submission.`,
        retryAfterMs: cooldownResult.retryAfterMs,
        tier: "cooldown",
      });
    }

    const minuteResult = await checkWindow(
      userId,
      "min",
      RATE_LIMITS.perMinute.windowMs,
      RATE_LIMITS.perMinute.maxRequests,
    );
    if (!minuteResult.allowed) {
      const retryAfterSecs = Math.ceil(minuteResult.retryAfterMs / 1000);
      res.set("Retry-After", String(retryAfterSecs));
      return res.status(429).json({
        message: `Rate limit exceeded. You've hit ${RATE_LIMITS.perMinute.maxRequests} submissions this minute. Try again in ${formatRetryAfter(minuteResult.retryAfterMs)}.`,
        retryAfterMs: minuteResult.retryAfterMs,
        tier: "perMinute",
        current: minuteResult.current,
        limit: minuteResult.limit,
      });
    }

    const hourResult = await checkWindow(
      userId,
      "hr",
      RATE_LIMITS.perHour.windowMs,
      RATE_LIMITS.perHour.maxRequests,
    );
    if (!hourResult.allowed) {
      const retryAfterSecs = Math.ceil(hourResult.retryAfterMs / 1000);
      res.set("Retry-After", String(retryAfterSecs));
      return res.status(429).json({
        message: `Hourly limit reached. You've used ${RATE_LIMITS.perHour.maxRequests} submissions this hour. Try again in ${formatRetryAfter(hourResult.retryAfterMs)}.`,
        retryAfterMs: hourResult.retryAfterMs,
        tier: "perHour",
        current: hourResult.current,
        limit: hourResult.limit,
      });
    }

    req.rateLimit = {
      minute: {
        remaining: RATE_LIMITS.perMinute.maxRequests - minuteResult.current,
        limit: RATE_LIMITS.perMinute.maxRequests,
      },
      hour: {
        remaining: RATE_LIMITS.perHour.maxRequests - hourResult.current,
        limit: RATE_LIMITS.perHour.maxRequests,
      },
    };

    res.set(
      "X-RateLimit-Limit-Minute",
      String(RATE_LIMITS.perMinute.maxRequests),
    );
    res.set(
      "X-RateLimit-Remaining-Minute",
      String(req.rateLimit.minute.remaining),
    );
    res.set("X-RateLimit-Limit-Hour", String(RATE_LIMITS.perHour.maxRequests));
    res.set("X-RateLimit-Remaining-Hour", String(req.rateLimit.hour.remaining));

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
