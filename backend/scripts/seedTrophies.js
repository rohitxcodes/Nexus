const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
dotenv.config();

const Trophy = require("../src/models/trophy.model");

const trophies = [
  {
    key: "FIRST_BLOOD",
    name: "First Blood",
    description: "Complete your first level",
    icon: "🩸",
  },
  {
    key: "ON_FIRE",
    name: "On Fire",
    description: "Complete 5 levels",
    icon: "🔥",
  },
  {
    key: "UNSTOPPABLE",
    name: "Unstoppable",
    description: "Complete 10 levels",
    icon: "⚡",
  },
  {
    key: "CENTURY",
    name: "Century",
    description: "Reach 1000 XP",
    icon: "💯",
  },
  {
    key: "LEGEND",
    name: "Legend",
    description: "Reach 5000 XP",
    icon: "👑",
  },
  {
    key: "CLAN_LEADER",
    name: "Clan Leader",
    description: "Create a clan",
    icon: "🛡️",
  },
  {
    key: "FIRST_WIN",
    name: "First Win",
    description: "Win your first 1v1 match",
    icon: "⚔️",
  },
  {
    key: "DUEL_MASTER",
    name: "Duel Master",
    description: "Win 10 x 1v1 matches",
    icon: "🏅",
  },
  {
    key: "CHALLENGER",
    name: "Challenger",
    description: "Play 5 x 1v1 matches",
    icon: "🎯",
  },
  {
    key: "CODE_WARRIOR",
    name: "Code Warrior",
    description: "Submit 50 solutions",
    icon: "💻",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Trophy.deleteMany({});
  await Trophy.insertMany(trophies);
  console.log("✅ 10 trophies seeded");
  await mongoose.disconnect();
}

seed().catch(console.error);
