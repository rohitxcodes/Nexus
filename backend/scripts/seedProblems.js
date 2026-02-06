const mongoose = require("mongoose");
const Problem = require("../src/models/problem.model");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

const problems = [
  {
    title: "Two Sum",
    description: "Return indices of two numbers that add to target.",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    constraints: "2 <= nums.length <= 10^4",
    levelNumber: 1,
    examples: [
      { input: "[2,7,11,15], 9", output: "[0,1]", explanation: "2+7=9" },
    ],
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "[0,1]", isHidden: false },
    ],
    prototypes: {
      javascript: "function twoSum(nums,target){\n\n}",
      python: "def twoSum(nums,target):\n    pass",
      java: "public int[] twoSum(int[] nums,int target){\n\n}",
      cpp: "vector<int> twoSum(vector<int>& nums,int target){\n\n}",
    },
  },

  {
    title: "Palindrome Number",
    description: "Check if integer is palindrome.",
    difficulty: "Easy",
    tags: ["Math"],
    constraints: "-2^31 <= x <= 2^31-1",
    levelNumber: 2,
    examples: [
      { input: "121", output: "true", explanation: "reads same both sides" },
    ],
    testCases: [{ input: "121", expectedOutput: "true", isHidden: false }],
    prototypes: {
      javascript: "function isPalindrome(x){\n\n}",
      python: "def isPalindrome(x):\n    pass",
      java: "public boolean isPalindrome(int x){\n\n}",
      cpp: "bool isPalindrome(int x){\n\n}",
    },
  },

  {
    title: "Longest Common Prefix",
    description: "Find longest common prefix among strings.",
    difficulty: "Easy",
    tags: ["String"],
    constraints: "1 <= n <= 200",
    levelNumber: 3,
    examples: [{ input: "flower flow flight", output: "fl", explanation: "" }],
    testCases: [
      { input: "flower flow flight", expectedOutput: "fl", isHidden: false },
    ],
    prototypes: {
      javascript: "function longestCommonPrefix(strs){\n\n}",
      python: "def longestCommonPrefix(strs):\n    pass",
      java: "public String longestCommonPrefix(String[] strs){\n\n}",
      cpp: "string longestCommonPrefix(vector<string>& strs){\n\n}",
    },
  },

  {
    title: "Valid Parentheses",
    description: "Validate bracket pairs.",
    difficulty: "Easy",
    tags: ["Stack"],
    constraints: "1 <= s.length <= 10^4",
    levelNumber: 4,
    examples: [{ input: "()[]{}", output: "true", explanation: "" }],
    testCases: [{ input: "()[]{}", expectedOutput: "true", isHidden: false }],
    prototypes: {
      javascript: "function isValid(s){\n\n}",
      python: "def isValid(s):\n    pass",
      java: "public boolean isValid(String s){\n\n}",
      cpp: "bool isValid(string s){\n\n}",
    },
  },

  {
    title: "Add Two Numbers",
    description: "Add two reversed linked lists.",
    difficulty: "Medium",
    tags: ["Linked List"],
    constraints: "1 <= nodes <= 100",
    levelNumber: 5,
    examples: [
      { input: "[2,4,3] + [5,6,4]", output: "[7,0,8]", explanation: "" },
    ],
    testCases: [{ input: "243\n564", expectedOutput: "708", isHidden: false }],
    prototypes: {
      javascript: "function addTwoNumbers(l1,l2){\n\n}",
      python: "def addTwoNumbers(l1,l2):\n    pass",
      java: "public ListNode addTwoNumbers(ListNode l1,ListNode l2){\n\n}",
      cpp: "ListNode* addTwoNumbers(ListNode* l1,ListNode* l2){\n\n}",
    },
  },

  {
    title: "Longest Substring Without Repeating Characters",
    description: "Return length of longest substring without duplicates.",
    difficulty: "Medium",
    tags: ["Sliding Window"],
    constraints: "0 <= n <= 50000",
    levelNumber: 6,
    examples: [{ input: "abcabcbb", output: "3", explanation: "" }],
    testCases: [{ input: "abcabcbb", expectedOutput: "3", isHidden: false }],
    prototypes: {
      javascript: "function lengthOfLongestSubstring(s){\n\n}",
      python: "def lengthOfLongestSubstring(s):\n    pass",
      java: "public int lengthOfLongestSubstring(String s){\n\n}",
      cpp: "int lengthOfLongestSubstring(string s){\n\n}",
    },
  },

  {
    title: "Longest Palindromic Substring",
    description: "Return longest palindromic substring.",
    difficulty: "Medium",
    tags: ["DP", "String"],
    constraints: "1 <= n <= 1000",
    levelNumber: 7,
    examples: [{ input: "babad", output: "bab", explanation: "" }],
    testCases: [{ input: "babad", expectedOutput: "bab", isHidden: false }],
    prototypes: {
      javascript: "function longestPalindrome(s){\n\n}",
      python: "def longestPalindrome(s):\n    pass",
      java: "public String longestPalindrome(String s){\n\n}",
      cpp: "string longestPalindrome(string s){\n\n}",
    },
  },

  {
    title: "Zigzag Conversion",
    description: "Convert string into zigzag pattern.",
    difficulty: "Medium",
    tags: ["String"],
    constraints: "1 <= n <= 1000",
    levelNumber: 8,
    examples: [
      { input: "PAYPALISHIRING, 3", output: "PAHNAPLSIIGYIR", explanation: "" },
    ],
    testCases: [
      {
        input: "PAYPALISHIRING\n3",
        expectedOutput: "PAHNAPLSIIGYIR",
        isHidden: false,
      },
    ],
    prototypes: {
      javascript: "function convert(s,numRows){\n\n}",
      python: "def convert(s,numRows):\n    pass",
      java: "public String convert(String s,int numRows){\n\n}",
      cpp: "string convert(string s,int numRows){\n\n}",
    },
  },

  {
    title: "Reverse Integer",
    description: "Reverse digits of integer.",
    difficulty: "Medium",
    tags: ["Math"],
    constraints: "32-bit signed integer range",
    levelNumber: 9,
    examples: [{ input: "123", output: "321", explanation: "" }],
    testCases: [{ input: "123", expectedOutput: "321", isHidden: false }],
    prototypes: {
      javascript: "function reverse(x){\n\n}",
      python: "def reverse(x):\n    pass",
      java: "public int reverse(int x){\n\n}",
      cpp: "int reverse(int x){\n\n}",
    },
  },

  {
    title: "String to Integer (atoi)",
    description: "Implement atoi conversion.",
    difficulty: "Medium",
    tags: ["String"],
    constraints: "0 <= length <= 200",
    levelNumber: 10,
    examples: [{ input: "42", output: "42", explanation: "" }],
    testCases: [{ input: "42", expectedOutput: "42", isHidden: false }],
    prototypes: {
      javascript: "function myAtoi(s){\n\n}",
      python: "def myAtoi(s):\n    pass",
      java: "public int myAtoi(String s){\n\n}",
      cpp: "int myAtoi(string s){\n\n}",
    },
  },

  {
    title: "Regular Expression Matching",
    description: "Regex matching with . and *.",
    difficulty: "Hard",
    tags: ["DP", "String"],
    constraints: "1 <= length <= 20",
    levelNumber: 11,
    examples: [{ input: "aa, a*", output: "true", explanation: "" }],
    testCases: [{ input: "aa\na*", expectedOutput: "true", isHidden: false }],
    prototypes: {
      javascript: "function isMatch(s,p){\n\n}",
      python: "def isMatch(s,p):\n    pass",
      java: "public boolean isMatch(String s,String p){\n\n}",
      cpp: "bool isMatch(string s,string p){\n\n}",
    },
  },

  {
    title: "Merge k Sorted Lists",
    description: "Merge k sorted linked lists.",
    difficulty: "Hard",
    tags: ["Heap", "Linked List"],
    constraints: "0 <= k <= 10^4",
    levelNumber: 12,
    examples: [
      {
        input: "[[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "",
      },
    ],
    testCases: [
      {
        input: "1 4 5|1 3 4|2 6",
        expectedOutput: "1 1 2 3 4 4 5 6",
        isHidden: false,
      },
    ],
    prototypes: {
      javascript: "function mergeKLists(lists){\n\n}",
      python: "def mergeKLists(lists):\n    pass",
      java: "public ListNode mergeKLists(ListNode[] lists){\n\n}",
      cpp: "ListNode* mergeKLists(vector<ListNode*>& lists){\n\n}",
    },
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
