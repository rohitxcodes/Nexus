const mongoose = require("mongoose");

const trophySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    // internal identifier used in code e.g. "FIRST_BLOOD"
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "🏆",
  },
});

module.exports = mongoose.model("Trophy", trophySchema);
