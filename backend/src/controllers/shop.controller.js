const shopService = require("../services/shop.service");

async function getHint(req, res) {
  try {
    const userId = req.user.userId;
    const hasPayload = req.body && Object.keys(req.body).length > 0;
    const result = hasPayload
      ? await shopService.invokeHint(userId, req.body)
      : await shopService.getHint(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function debugCode(req, res) {
  try {
    const userId = req.user.userId;
    const result = await shopService.debugCode(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function buyDoubleXP(req, res) {
  try {
    const userId = req.user.userId;
    const result = await shopService.buyDoubleXP(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function skipLevel(req, res) {
  try {
    const userId = req.user.userId;
    const result = await shopService.skipLevel(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getCashBalance(req, res) {
  try {
    const userId = req.user.userId;
    const result = await shopService.getCashBalance(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function addCash(req, res) {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;
    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "amount is required" });
    }
    const result = await shopService.addCash(userId, Number(amount));
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function usePower(req, res) {
  try {
    const userId = req.user.userId;
    const result = await shopService.usePower(userId, req.body || {});
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  getHint,
  debugCode,
  buyDoubleXP,
  skipLevel,
  getCashBalance,
  addCash,
  usePower,
};
