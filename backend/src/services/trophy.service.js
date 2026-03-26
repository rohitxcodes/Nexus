const UserTrophy = require("../models/userTrophy.model");
const Submission = require("../models/submission.model");
const Match = require("../models/match.model");
const User = require("../models/user.model");
const Trophy = require("../models/trophy.model");

// ── Core: award a trophy (silently skips if already earned) ──
async function awardTrophy(userId, trophyKey) {
  try {
    await UserTrophy.create({ userId, trophyKey });
    console.log(`[Trophy] ${trophyKey} awarded to ${userId}`);
    return trophyKey;
  } catch (err) {
    // Duplicate key error = already earned, silently ignore
    if (err.code === 11000) return null;
    throw err;
  }
}

// ── Check all trophies after a submission
async function checkSubmissionTrophies(
  userId,
  levelNumber,
  totalXP,
  completedLevels,
) {
  const awarded = [];

  // FIRST_BLOOD — completed at least 1 level
  if (completedLevels.length >= 1) {
    const r = await awardTrophy(userId, "FIRST_BLOOD");
    if (r) awarded.push(r);
  }

  // ON_FIRE — completed 5 levels
  if (completedLevels.length >= 5) {
    const r = await awardTrophy(userId, "ON_FIRE");
    if (r) awarded.push(r);
  }

  // UNSTOPPABLE — completed 10 levels
  if (completedLevels.length >= 10) {
    const r = await awardTrophy(userId, "UNSTOPPABLE");
    if (r) awarded.push(r);
  }

  // CENTURY — 1000 XP
  if (totalXP >= 1000) {
    const r = await awardTrophy(userId, "CENTURY");
    if (r) awarded.push(r);
  }

  // LEGEND — 5000 XP
  if (totalXP >= 5000) {
    const r = await awardTrophy(userId, "LEGEND");
    if (r) awarded.push(r);
  }

  // CODE_WARRIOR — 50 total submissions (any verdict)
  const submissionCount = await Submission.countDocuments({ userId });
  if (submissionCount >= 50) {
    const r = await awardTrophy(userId, "CODE_WARRIOR");
    if (r) awarded.push(r);
  }

  return awarded;
}

// ── Check all trophies after a match win
async function checkMatchTrophies(userId) {
  const awarded = [];

  // Count total matches played by this user
  const totalMatches = await Match.countDocuments({
    $or: [{ player1Id: userId }, { player2Id: userId }],
    status: { $in: ["COMPLETED", "CANCELLED"] },
  });

  // CHALLENGER — 5 matches played
  if (totalMatches >= 5) {
    const r = await awardTrophy(userId, "CHALLENGER");
    if (r) awarded.push(r);
  }

  // Count wins
  const totalWins = await Match.countDocuments({
    winnerId: userId,
    status: "COMPLETED",
  });

  // FIRST_WIN — 1 win
  if (totalWins >= 1) {
    const r = await awardTrophy(userId, "FIRST_WIN");
    if (r) awarded.push(r);
  }

  // DUEL_MASTER — 10 wins
  if (totalWins >= 10) {
    const r = await awardTrophy(userId, "DUEL_MASTER");
    if (r) awarded.push(r);
  }

  return awarded;
}

// ── Check clan trophy
async function checkClanTrophy(userId) {
  const awarded = [];
  const r = await awardTrophy(userId, "CLAN_LEADER");
  if (r) awarded.push(r);
  return awarded;
}

// ── Get all trophies with user's earned status
async function getAllTrophies(userId) {
  const allTrophies = await Trophy.find({}).lean();
  const earned = await UserTrophy.find({ userId }).lean();

  const earnedKeys = new Set(earned.map((t) => t.trophyKey));

  return allTrophies.map((t) => ({
    key: t.key,
    name: t.name,
    description: t.description,
    icon: t.icon,
    earned: earnedKeys.has(t.key),
    earnedAt: earned.find((e) => e.trophyKey === t.key)?.createdAt ?? null,
  }));
}

// ── Get only user's earned trophies
async function getMyTrophies(userId) {
  const earned = await UserTrophy.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const trophies = await Trophy.find({
    key: { $in: earned.map((e) => e.trophyKey) },
  }).lean();

  const trophyMap = {};
  trophies.forEach((t) => (trophyMap[t.key] = t));

  return earned.map((e) => ({
    ...trophyMap[e.trophyKey],
    earnedAt: e.createdAt,
  }));
}

module.exports = {
  checkSubmissionTrophies,
  checkMatchTrophies,
  checkClanTrophy,
  getAllTrophies,
  getMyTrophies,
};
