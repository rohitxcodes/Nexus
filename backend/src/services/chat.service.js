const Message = require("../models/message.model");
const Clan = require("../models/clan.model");
const User = require("../models/user.model");

// Reusable membership check used by both REST and Socket
async function assertMembership(userId, clanId) {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");
  if (!user.clan || user.clan.toString() !== clanId.toString()) {
    throw new Error("You are not a member of this clan");
  }
}

// Called by REST endpoint on page load — returns last 50 messages
async function getChatHistory(clanId, requestingUserId) {
  const clan = await Clan.findById(clanId).lean();
  if (!clan) throw new Error("Clan not found");

  await assertMembership(requestingUserId, clanId);

  const messages = await Message.find({ clanId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("senderId", "username")
    .lean();

  // Reverse so oldest is first (chronological order for UI)
  return messages.reverse().map((m) => ({
    _id: m._id,
    sender: {
      _id: m.senderId._id,
      username: m.senderId.username,
    },
    content: m.content,
    createdAt: m.createdAt,
  }));
}

// Called by Socket when user sends a message
async function saveMessage(clanId, senderId, content) {
  if (!content || !content.trim()) throw new Error("Message cannot be empty");

  await assertMembership(senderId, clanId);

  const message = await Message.create({
    clanId,
    senderId,
    content: content.trim(),
  });

  const populated = await message.populate("senderId", "username");

  return {
    _id: populated._id,
    sender: {
      _id: populated.senderId._id,
      username: populated.senderId.username,
    },
    content: populated.content,
    createdAt: populated.createdAt,
  };
}

module.exports = { getChatHistory, saveMessage, assertMembership };
