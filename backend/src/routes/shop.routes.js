const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const shopController = require("../controllers/shop.controller");

router.post("/hint", requireAuth, shopController.getHint);
router.post("/debug", requireAuth, shopController.debugCode);
router.post("/double-xp", requireAuth, shopController.buyDoubleXP);
router.post("/skip-level", requireAuth, shopController.skipLevel);
router.post("/use", requireAuth, shopController.usePower);
router.get("/cash", requireAuth, shopController.getCashBalance);
router.post("/cash/add", requireAuth, shopController.addCash);

module.exports = router;
