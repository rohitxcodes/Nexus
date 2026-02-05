async function getUserProfile(req, res, next) {return res.send("ok")}
async function getUserProgress(req, res, next) {return res.send("ok")}

module.exports = {
  getUserProfile,
  getUserProgress
};
