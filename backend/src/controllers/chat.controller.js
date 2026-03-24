const chatService = require("../services/chat.service");

async function getChatHistory(req, res) {
  try {
    const { clanId } = req.params;
    const userId = req.user.userId;

    const messages = await chatService.getChatHistory(clanId, userId);

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { getChatHistory };
