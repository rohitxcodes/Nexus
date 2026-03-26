const Match = require("../models/match.model");
const User = require("../models/user.model");
const Problem = require("../models/problem.model");
const { persistSubmission } = require("./submission/submission.service");

// ── Helper: pick problem
async function pickProblem(problemId) {
  if (problemId) {
    const problem = await Problem.findById(problemId).lean();
    if (!problem) throw new Error("Problem not found");
    return problem._id;
  }

  // Random — no problemId provided
  const count = await Problem.countDocuments();
  if (count === 0) throw new Error("No problems available");
  const skip = Math.floor(Math.random() * count);
  const problem = await Problem.findOne().skip(skip).lean();
  return problem._id;
}

// ── Challenge
async function challengeUser(challengerId, opponentId, problemId) {
  if (challengerId.toString() === opponentId.toString()) {
    throw new Error("You cannot challenge yourself");
  }

  const opponent = await User.findById(opponentId);
  if (!opponent) throw new Error("Opponent not found");

  // Block if active match already exists between these two
  const existing = await Match.findOne({
    $or: [
      { player1Id: challengerId, player2Id: opponentId },
      { player1Id: opponentId, player2Id: challengerId },
    ],
    status: { $in: ["PENDING", "ONGOING"] },
  });
  if (existing)
    throw new Error("You already have an active match with this player");

  const chosenProblemId = await pickProblem(problemId);

  // Populate problem title for response
  const problem = await Problem.findById(chosenProblemId).select(
    "title difficulty levelNumber",
  );

  const match = await Match.create({
    player1Id: challengerId,
    player2Id: opponentId,
    problemId: chosenProblemId,
    status: "PENDING",
  });

  return {
    matchId: match._id,
    status: match.status,
    opponent: {
      _id: opponent._id,
      username: opponent.username,
    },
    problem: {
      _id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      levelNumber: problem.levelNumber,
    },
  };
}

// ── Accept
async function acceptChallenge(matchId, userId) {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found");

  if (match.player2Id.toString() !== userId.toString()) {
    throw new Error("Only the challenged player can accept");
  }
  if (match.status !== "PENDING") throw new Error("Match is not pending");

  match.status = "ONGOING";
  match.startedAt = new Date();
  await match.save();

  return match;
}

// ── Decline
async function declineChallenge(matchId, userId) {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found");

  if (match.player2Id.toString() !== userId.toString()) {
    throw new Error("Only the challenged player can decline");
  }
  if (match.status !== "PENDING") throw new Error("Match is not pending");

  match.status = "CANCELLED";
  await match.save();

  return match;
}

// ── Submit code inside a match
async function submitMatchCode(matchId, userId, language, code) {
  const match = await Match.findById(matchId).populate("problemId");
  if (!match) throw new Error("Match not found");
  if (match.status !== "ONGOING") throw new Error("Match is not ongoing");

  const isPlayer =
    match.player1Id.toString() === userId.toString() ||
    match.player2Id.toString() === userId.toString();
  if (!isPlayer) throw new Error("You are not a participant in this match");

  // Run through existing Judge0 pipeline
  const result = await persistSubmission({
    userId,
    levelNumber: match.problemId.levelNumber,
    language,
    code,
  });

  // If accepted — check match is still ONGOING before closing
  // (race condition guard — other player may have just won)
  if (result.verdict === "ACCEPTED") {
    const freshMatch = await Match.findById(matchId);
    if (freshMatch.status === "ONGOING") {
      freshMatch.status = "COMPLETED";
      freshMatch.winnerId = userId;
      freshMatch.endedAt = new Date();
      await freshMatch.save();
    }
  }

  const updatedMatch = await Match.findById(matchId);

  return {
    verdict: result.verdict,
    runtime: result.runtime,
    memory: result.memory,
    xpEarned: result.xpEarned,
    matchStatus: updatedMatch.status,
    winnerId: updatedMatch.winnerId ?? null,
  };
}

// ── Get match
async function getMatch(matchId, userId) {
  const match = await Match.findById(matchId)
    .populate("player1Id", "username totalXP")
    .populate("player2Id", "username totalXP")
    .populate("problemId", "title difficulty levelNumber")
    .populate("winnerId", "username")
    .lean();

  if (!match) throw new Error("Match not found");

  const isParticipant =
    match.player1Id._id.toString() === userId.toString() ||
    match.player2Id._id.toString() === userId.toString();
  if (!isParticipant) throw new Error("Access denied");

  return match;
}

// ── Match history
async function getMatchHistory(userId) {
  const matches = await Match.find({
    $or: [{ player1Id: userId }, { player2Id: userId }],
    status: { $in: ["COMPLETED", "CANCELLED"] },
  })
    .sort({ updatedAt: -1 })
    .limit(20)
    .populate("player1Id", "username")
    .populate("player2Id", "username")
    .populate("problemId", "title difficulty")
    .populate("winnerId", "username")
    .lean();

  return matches.map((m) => ({
    ...m,
    result:
      m.status === "COMPLETED"
        ? m.winnerId?._id?.toString() === userId.toString()
          ? "WIN"
          : "LOSS"
        : "CANCELLED",
  }));
}

module.exports = {
  challengeUser,
  acceptChallenge,
  declineChallenge,
  submitMatchCode,
  getMatch,
  getMatchHistory,
};
