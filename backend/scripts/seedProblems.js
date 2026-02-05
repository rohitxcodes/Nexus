const mongoose = require("mongoose");
const Problem = require("../src/models/problem.model");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

const problems = [
  {
    levelNumber: 1,
    title: "Find Pair With Given Sum",
    difficulty: "Easy",
    tags: ["array", "hashing"],
    description:
      "Given an array of integers and a target value, determine whether there exists a pair of numbers in the array whose sum equals the target.",
    constraints: "2 ≤ n ≤ 10^4, -10^9 ≤ arr[i] ≤ 10^9",
    examples: [
      {
        input: "arr = [2, 7, 11, 15], target = 9",
        output: "true",
        explanation: "2 + 7 = 9",
      },
    ],
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "true", isHidden: false },
      { input: "3\n3 2 4\n6", expectedOutput: "true", isHidden: true },
    ],
  },

  {
    levelNumber: 2,
    title: "Check Palindrome Number",
    difficulty: "Easy",
    tags: ["math"],
    description: "Given an integer x, determine whether it is a palindrome.",
    constraints: "-2^31 ≤ x ≤ 2^31 - 1",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads the same backward",
      },
    ],
    testCases: [
      { input: "121", expectedOutput: "true", isHidden: false },
      { input: "-121", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    levelNumber: 3,
    title: "Longest Common Prefix",
    difficulty: "Medium",
    tags: ["string"],
    description:
      "Given an array of strings, find the longest common prefix string among them.",
    constraints: "1 ≤ strs.length ≤ 200, 0 ≤ strs[i].length ≤ 200",
    examples: [
      {
        input: '["flower","flow","flight"]',
        output: '"fl"',
        explanation: "All strings share the prefix 'fl'",
      },
    ],
    testCases: [
      {
        input: "3\nflower\nflow\nflight",
        expectedOutput: "fl",
        isHidden: false,
      },
    ],
  },

  {
    levelNumber: 4,
    title: "Valid Parentheses",
    difficulty: "Medium",
    tags: ["stack"],
    description:
      "Given a string containing just the characters (), {}, and [], determine if the input string is valid.",
    constraints: "1 ≤ s.length ≤ 10^4",
    examples: [
      {
        input: '"()[]{}"',
        output: "true",
        explanation: "All brackets are properly closed",
      },
    ],
    testCases: [
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    levelNumber: 5,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["linked-list", "math"],
    description:
      "You are given two non-empty linked lists representing two non-negative integers stored in reverse order. Add the two numbers and return the sum as a linked list.",
    constraints: "1 ≤ number of nodes ≤ 100, 0 ≤ node.val ≤ 9",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807",
      },
    ],
    testCases: [
      { input: "2 4 3\n5 6 4", expectedOutput: "7 0 8", isHidden: false },
    ],
  },

  {
    levelNumber: 6,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    tags: ["dp", "string"],
    description:
      "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
    constraints: "1 ≤ s.length, p.length ≤ 30",
    examples: [
      {
        input: 's = "aa", p = "a*"',
        output: "true",
        explanation: "'*' allows repeating the preceding element",
      },
    ],
    testCases: [{ input: "aa\na*", expectedOutput: "true", isHidden: false }],
  },

  {
    levelNumber: 7,
    title: "Reverse Integer",
    difficulty: "Easy",
    tags: ["math"],
    description:
      "Given a signed 32-bit integer x, return x with its digits reversed.",
    constraints: "-2^31 ≤ x ≤ 2^31 - 1",
    examples: [
      {
        input: "x = 123",
        output: "321",
        explanation: "Digits reversed",
      },
    ],
    testCases: [
      { input: "123", expectedOutput: "321", isHidden: false },
      { input: "1534236469", expectedOutput: "0", isHidden: true },
    ],
  },

  {
    levelNumber: 8,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["linked-list"],
    description:
      "Merge two sorted linked lists and return it as a sorted list.",
    constraints: "0 ≤ number of nodes ≤ 50",
    examples: [
      {
        input: "l1 = [1,2,4], l2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merged in sorted order",
      },
    ],
    testCases: [
      { input: "1 2 4\n1 3 4", expectedOutput: "1 1 2 3 4 4", isHidden: false },
    ],
  },

  {
    levelNumber: 9,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["binary-search"],
    description:
      "Given a rotated sorted array, search for a target value and return its index or -1.",
    constraints: "1 ≤ nums.length ≤ 5000",
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "Target found at index 4",
      },
    ],
    testCases: [
      { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4", isHidden: false },
    ],
  },

  {
    levelNumber: 10,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["two-pointers"],
    description:
      "Given n non-negative integers, find two lines that together with the x-axis form a container that holds the most water.",
    constraints: "2 ≤ n ≤ 10^5",
    examples: [
      {
        input: "[1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "Max area formed between heights 8 and 7",
      },
    ],
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false },
    ],
  },

  {
    levelNumber: 11,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["string", "dp"],
    description:
      "Given a string s, return the longest palindromic substring in s.",
    constraints: "1 ≤ s.length ≤ 1000",
    examples: [
      {
        input: "babad",
        output: "bab",
        explanation: "bab is a valid palindrome",
      },
    ],
    testCases: [{ input: "babad", expectedOutput: "bab", isHidden: false }],
  },

  {
    levelNumber: 12,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["binary-search"],
    description:
      "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.",
    constraints: "0 ≤ nums1.length + nums2.length ≤ 2000",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2",
        explanation: "Median is 2",
      },
    ],
    testCases: [{ input: "1 3\n2", expectedOutput: "2", isHidden: false }],
  },
];

async function seedProblems() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);

    console.log("Clearing old problems...");
    await Problem.deleteMany({});

    console.log("Inserting problems...");
    await Problem.insertMany(problems);

    console.log(" Problems seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedProblems();
