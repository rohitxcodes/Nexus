require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Level = require("../src/models/level.model");

const MONGO_URI = process.env.MONGO_URI;

const levels = [
  { levelNumber: 1, difficulty: "Easy", xpReward: 30, topic: "Arcade" },
  { levelNumber: 2, difficulty: "Easy", xpReward: 30, topic: "Array" },

  { levelNumber: 3, difficulty: "Medium", xpReward: 40, topic: "Array" },
  { levelNumber: 4, difficulty: "Medium", xpReward: 40, topic: "LinkedList" },
  { levelNumber: 5, difficulty: "Medium", xpReward: 40, topic: "LinkedList" },

  { levelNumber: 6, difficulty: "Hard", xpReward: 100, topic: "Stack" },

  { levelNumber: 7, difficulty: "Easy", xpReward: 30, topic: "Queue" },
  { levelNumber: 8, difficulty: "Easy", xpReward: 30, topic: "Tree" },

  { levelNumber: 9, difficulty: "Medium", xpReward: 40, topic: "Tree" },
  { levelNumber: 10, difficulty: "Medium", xpReward: 40, topic: "Graph" },
  { levelNumber: 11, difficulty: "Medium", xpReward: 40, topic: "Sorting" },

  { levelNumber: 12, difficulty: "Hard", xpReward: 100, topic: "Searching" },
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
