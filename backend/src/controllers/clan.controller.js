const clanService = require("../services/clan.service");

async function createClan(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    const clan = await clanService.createClan(userId, name, description);

    res.status(201).json({ success: true, clan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
async function leaveClan(req, res) {
  try {
    const userId = req.user.userId;

    const result = await clanService.leaveClan(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
async function removeMember(req, res) {
  try {
    const { clanId, userIdToRemove } = req.body;
    const adminId = req.user.userId;

    const result = await clanService.removeMember(
      adminId,
      clanId,
      userIdToRemove,
    );

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
async function requestJoin(req, res) {
  try {
    const { clanId } = req.body;
    const userId = req.user.userId;

    const result = await clanService.requestJoinClan(userId, clanId);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function approveRequest(req, res) {
  try {
    const { clanId, userIdToApprove } = req.body;
    const adminId = req.user.userId;

    const result = await clanService.approveJoinRequest(
      adminId,
      clanId,
      userIdToApprove,
    );

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function rejectRequest(req, res) {
  try {
    const { clanId, userIdToReject } = req.body;
    const adminId = req.user.userId;

    const result = await clanService.rejectJoinRequest(
      adminId,
      clanId,
      userIdToReject,
    );

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getPendingRequests(req, res) {
  try {
    const { clanId } = req.params;
    const adminId = req.user.userId;

    const data = await clanService.getPendingRequests(adminId, clanId);

    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
async function deleteClan(req, res) {
  try {
    const { clanId } = req.body;
    const adminId = req.user.userId;

    const result = await clanService.deleteClan(adminId, clanId);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
async function addMembers(req, res) {
  try {
    const { clanId, userIds } = req.body; // array of userIds
    const adminId = req.user.userId;

    const result = await clanService.addMembers(adminId, clanId, userIds);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
module.exports = {
  createClan,
  requestJoin,
  approveRequest,
  rejectRequest,
  getPendingRequests,
  deleteClan,
  addMembers,
  leaveClan,
  removeMember,
};
