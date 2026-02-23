const Clan = require("../models/clan.model");
const User = require("../models/user.model");

// Create Clan
async function createClan(userId, name, description) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.clan) throw new Error("Already in a clan");

  const existing = await Clan.findOne({ name });
  if (existing) throw new Error("Clan name already taken");

  const clan = await Clan.create({
    name,
    description,
    admin: userId,
  });

  user.clan = clan._id;
  await user.save();

  return clan;
}

// Send Join Request
async function requestJoinClan(userId, clanId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.clan) throw new Error("Already in a clan");

  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.joinRequests.includes(userId)) {
    throw new Error("Already requested to join");
  }

  clan.joinRequests.push(userId);
  await clan.save();

  return { message: "Join request sent to admin" };
}

// Approve Join Request (Admin Only)
async function approveJoinRequest(adminId, clanId, userIdToApprove) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can approve requests");
  }

  const requestExists = clan.joinRequests.some(
    (id) => id.toString() === userIdToApprove.toString(),
  );

  if (!requestExists) {
    throw new Error("No such join request");
  }

  const user = await User.findById(userIdToApprove);
  if (!user) throw new Error("User not found");
  if (user.clan) throw new Error("User already in a clan");

  // Assign clan
  user.clan = clanId;
  await user.save();

  // Remove request
  clan.joinRequests = clan.joinRequests.filter(
    (id) => id.toString() !== userIdToApprove.toString(),
  );

  await clan.save();

  return { message: "User added to clan" };
}

// Reject Join Request (Admin Only)
async function rejectJoinRequest(adminId, clanId, userIdToReject) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can reject requests");
  }

  const requestExists = clan.joinRequests.some(
    (id) => id.toString() === userIdToReject.toString(),
  );

  if (!requestExists) {
    throw new Error("No such join request");
  }
  await clan.save();

  return { message: "Join request rejected" };
}

// Get Pending Requests (Admin Only)
async function getPendingRequests(adminId, clanId) {
  const clan = await Clan.findById(clanId).populate(
    "joinRequests",
    "username totalXP",
  );

  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can view requests");
  }

  return {
    clanName: clan.name,
    pending: clan.joinRequests,
  };
}
// Delete Clan (Admin Only)
async function deleteClan(adminId, clanId) {
  const clan = await Clan.findById(clanId);
  if (!clan) throw new Error("Clan not found");

  if (clan.admin.toString() !== adminId.toString()) {
    throw new Error("Only admin can delete clan");
  }

  // Remove clan reference from all users
  await User.updateMany({ clan: clanId }, { $unset: { clan: "" } });

  await Clan.deleteOne({ _id: clanId });

  return { message: "Clan deleted successfully" };
}

module.exports = {
  createClan,
  requestJoinClan,
  approveJoinRequest,
  rejectJoinRequest,
  getPendingRequests,
  deleteClan,
};
