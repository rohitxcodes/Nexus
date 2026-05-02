jest.mock("../models/rateLimitWindow.model", () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

const RateLimitWindow = require("../models/rateLimitWindow.model");
const submissionRateLimit = require("../middleware/submissionRateLimit.middleware");

function makeReq(userId = "user-1") {
  return { user: { userId } };
}

function makeRes() {
  const res = {
    headers: {},
    statusCode: 200,
    body: null,
    set(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return res;
}

describe("submissionRateLimit middleware", () => {
  let store;
  let now;

  beforeEach(() => {
    store = new Map();
    now = 1_000_000;
    jest.spyOn(Date, "now").mockImplementation(() => now);

    RateLimitWindow.findOne.mockImplementation(({ key }) => ({
      select: () => ({
        lean: async () => {
          const doc = store.get(key);
          if (!doc) return null;
          return { lastTs: doc.lastTs ?? null };
        },
      }),
    }));

    RateLimitWindow.findOneAndUpdate.mockImplementation(
      async ({ key }, update, options = {}) => {
        const existed = store.has(key);
        let doc = store.get(key);

        if (!doc) {
          if (!options.upsert) return null;
          doc = { key, count: 0, lastTs: null, expiresAt: null };
        }

        if (update.$inc?.count) {
          doc.count = (doc.count || 0) + update.$inc.count;
        }

        if (update.$setOnInsert && !existed) {
          doc = { ...doc, ...update.$setOnInsert };
        }

        if (update.$set) {
          doc = { ...doc, ...update.$set };
        }

        store.set(key, doc);
        return doc;
      },
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("allows first submission and sets quota headers", async () => {
    const req = makeReq();
    const res = makeRes();
    const next = jest.fn();

    await submissionRateLimit(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.headers["X-RateLimit-Limit-20s"]).toBe("5");
    expect(res.headers["X-RateLimit-Remaining-20s"]).toBe("4");
    expect(res.headers["X-RateLimit-Limit-10m"]).toBe("20");
    expect(res.headers["X-RateLimit-Remaining-10m"]).toBe("19");
  });

  it("blocks a 6th submission inside 20 seconds", async () => {
    const next = jest.fn();

    for (let i = 0; i < 5; i += 1) {
      const res = makeRes();
      await submissionRateLimit(makeReq(), res, next);
      now += 2_000;
      expect(res.statusCode).toBe(200);
    }

    const res2 = makeRes();
    await submissionRateLimit(makeReq(), res2, next);

    expect(next).toHaveBeenCalledTimes(5);
    expect(res2.statusCode).toBe(429);
    expect(res2.body.tier).toBe("burst");
    expect(Number(res2.headers["Retry-After"])).toBeGreaterThan(0);
  });

  it("blocks the 21st submission in 10 minutes", async () => {
    const next = jest.fn();
    now = 600_001;

    for (let i = 0; i < 20; i += 1) {
      const res = makeRes();
      await submissionRateLimit(makeReq(), res, next);
      now += 11_000;
      expect(res.statusCode).toBe(200);
    }

    const blockedRes = makeRes();
    await submissionRateLimit(makeReq(), blockedRes, next);

    expect(blockedRes.statusCode).toBe(429);
    expect(blockedRes.body.tier).toBe("longWindow");
    expect(Number(blockedRes.headers["Retry-After"])).toBeGreaterThan(0);
  });
});
