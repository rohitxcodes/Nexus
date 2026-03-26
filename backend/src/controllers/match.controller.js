const matchService = require("../services/match.service");

async function challenge(req, res) {
  try {
    const challengerId = req.user.userId;
    const { opponentId, problemId } = req.body;

    if (!opponentId) {
      return res
        .status(400)
        .json({ success: false, message: "opponentId is required" });
    }

    const result = await matchService.challengeUser(
      challengerId,
      opponentId,
      problemId,
    );
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function accept(req, res) {
  try {
    const { matchId } = req.params;
    const userId = req.user.userId;

    const match = await matchService.acceptChallenge(matchId, userId);
    res.status(200).json({ success: true, match });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function decline(req, res) {
  try {
    const { matchId } = req.params;
    const userId = req.user.userId;

    const match = await matchService.declineChallenge(matchId, userId);
    res.status(200).json({ success: true, match });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function submitCode(req, res) {
  try {
    const { matchId } = req.params;
    const userId = req.user.userId;
    const { language, code } = req.body;

    if (!language || !code) {
      return res
        .status(400)
        .json({ success: false, message: "language and code are required" });
    }

    const result = await matchService.submitMatchCode(
      matchId,
      userId,
      language,
      code,
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function history(req, res) {
  try {
    const userId = req.user.userId;
    const matches = await matchService.getMatchHistory(userId);
    res.status(200).json({ success: true, matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getMatch(req, res) {
  try {
    const { matchId } = req.params;
    const userId = req.user.userId;

    const match = await matchService.getMatch(matchId, userId);
    res.status(200).json({ success: true, match });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { challenge, accept, decline, submitCode, history, getMatch };
