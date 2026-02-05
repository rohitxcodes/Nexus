require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Level = require("../src/models/level.model");

const MONGO_URI = process.env.MONGO_URI;

const levels = [
  { levelNumber: 1, difficulty: "Easy", xpReward: 30 },
  { levelNumber: 2, difficulty: "Easy", xpReward: 30 },

  { levelNumber: 3, difficulty: "Medium", xpReward: 40 },
  { levelNumber: 4, difficulty: "Medium", xpReward: 40 },
  { levelNumber: 5, difficulty: "Medium", xpReward: 40 },

  { levelNumber: 6, difficulty: "Hard", xpReward: 100 },

  { levelNumber: 7, difficulty: "Easy", xpReward: 30 },
  { levelNumber: 8, difficulty: "Easy", xpReward: 30 },

  { levelNumber: 9, difficulty: "Medium", xpReward: 40 },
  { levelNumber: 10, difficulty: "Medium", xpReward: 40 },
  { levelNumber: 11, difficulty: "Medium", xpReward: 40 },

  { levelNumber: 12, difficulty: "Hard", xpReward: 100 },
];

async function seedLevels() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);

    console.log("Clearing old levels...");
    await Level.deleteMany({});

    console.log("Inserting levels...");
    await Level.insertMany(levels);

    console.log(" Levels seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(" Level seeding failed:", err);
    process.exit(1);
  }
}

seedLevels();
