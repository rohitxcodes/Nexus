const Clan = require("../models/clan.model");
const User = require("../models/user.model");
const { checkClanTrophy } = require("./trophy.service");

async function createClan(userId, name, description) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.clan) throw new Error("Already in a clan");

  const existing = await Clan.findOne({ name });
  if (existing) throw new Error("Clan name already taken");

  const clan = await Clan.create({ name, description, admin: userId });

  user.clan = clan._id;
  await user.save();

  // Award CLAN_LEADER trophy
  await checkClanTrophy(userId);

  return clan;
}

async function requestJoinClan(userId, clanId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.clan) throw new Error("Already in a clan");

  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.joinRequests.some((id) => id.toString() === userId.toString())) {
    throw new Error("Already requested to join");
  }

  clan.joinRequests.push(userId);
  await clan.save();

  return { message: "Join request sent to admin" };
}

async function approveJoinRequest(adminId, clanId, userIdToApprove) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can approve requests");
  }

  const requestExists = clan.joinRequests.some(
    (id) => id.toString() === userIdToApprove.toString(),
  );
  if (!requestExists) throw new Error("No such join request");

  const user = await User.findById(userIdToApprove);
  if (!user) throw new Error("User not found");

  if (user.clan) {
    clan.joinRequests = clan.joinRequests.filter(
      (id) => id.toString() !== userIdToApprove.toString(),
    );
    await clan.save();
    throw new Error("User already in a clan");
  }

  user.clan = clanId;
  await user.save();

  clan.joinRequests = clan.joinRequests.filter(
    (id) => id.toString() !== userIdToApprove.toString(),
  );
  await clan.save();

  return { message: "User added to clan" };
}

async function rejectJoinRequest(adminId, clanId, userIdToReject) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can reject requests");
  }

  const requestExists = clan.joinRequests.some(
    (id) => id.toString() === userIdToReject.toString(),
  );
  if (!requestExists) throw new Error("No such join request");

  clan.joinRequests = clan.joinRequests.filter(
    (id) => id.toString() !== userIdToReject.toString(),
  );
  await clan.save();

  return { message: "Join request rejected" };
}

async function getPendingRequests(adminId, clanId) {
  const clan = await Clan.findById(clanId).populate(
    "joinRequests",
    "username totalXP",
  );
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can view requests");
  }

  return { clanName: clan.name, pending: clan.joinRequests };
}

async function deleteClan(adminId, clanId) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can delete clan");
  }

  await User.updateMany({ clan: clanId }, { $unset: { clan: "" } });
  await Clan.deleteOne({ _id: clanId });

  return { message: "Clan deleted successfully" };
}

async function addMembers(adminId, clanId, userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds must be a non-empty array");
  }

  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can add members");
  }

  const users = await User.find({ _id: { $in: userIds } });
  for (const user of users) {
    if (user.clan) continue;
    user.clan = clanId;
    await user.save();
  }

  return { message: "Members added successfully" };
}

async function leaveClan(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!user.clan) throw new Error("Not in any clan");

  const clan = await Clan.findById(user.clan);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() === userId.toString()) {
    throw new Error("Admin cannot leave. Delete or transfer clan.");
  }

  user.clan = null;
  await user.save();

  return { message: "Left clan successfully" };
}

async function removeMember(adminId, clanId, userIdToRemove) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can remove members");
  }

  if (adminId.toString() === userIdToRemove.toString()) {
    throw new Error("Admin cannot remove themselves");
  }

  const user = await User.findById(userIdToRemove);
  if (!user) throw new Error("User not found");

  if (!user.clan || user.clan.toString() !== clanId.toString()) {
    throw new Error("User not in this clan");
  }

  user.clan = null;
  await user.save();

  return { message: "Member removed successfully" };
}

async function getAllClans() {
  const clans = await Clan.find({}).populate("admin", "username").lean();

  const memberCounts = await User.aggregate([
    { $match: { clan: { $ne: null } } },
    { $group: { _id: "$clan", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  memberCounts.forEach((c) => {
    countMap[c._id.toString()] = c.count;
  });

  return clans.map((clan) => ({
    _id: clan._id,
    name: clan.name,
    description: clan.description,
    admin: clan.admin,
    memberCount: countMap[clan._id.toString()] || 1,
    createdAt: clan.createdAt,
  }));
}

async function getClanById(clanId, requestingUserId) {
  const clan = await Clan.findById(clanId)
    .populate("admin", "username totalXP")
    .lean();
  if (!clan) throw new Error("Clan not found");

  const members = await User.find({ clan: clanId })
    .select("username totalXP currentLevel completedLevels createdAt")
    .sort({ totalXP: -1, createdAt: 1 })
    .lean();

  const rankedMembers = members.map((m, i) => ({ ...m, rank: i + 1 }));

  return {
    clan: {
      _id: clan._id,
      name: clan.name,
      description: clan.description,
      admin: clan.admin,
      createdAt: clan.createdAt,
    },
    members: rankedMembers,
    memberCount: rankedMembers.length,
    isAdmin: clan.admin._id.toString() === requestingUserId.toString(),
  };
}

async function getMyClan(userId) {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");
  if (!user.clan) throw new Error("You are not in any clan");

  return getClanById(user.clan.toString(), userId);
}

module.exports = {
  createClan,
  requestJoinClan,
  approveJoinRequest,
  rejectJoinRequest,
  getPendingRequests,
  deleteClan,
  addMembers,
  leaveClan,
  removeMember,
  getAllClans,
  getClanById,
  getMyClan,
};
