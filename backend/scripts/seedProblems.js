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
    boilerplates: {
      javascript:
        '{{USER_CODE}}\n\n(function(){\n  const testCases = {{TEST_CASES}};\n  for(const tc of testCases){\n    const lines = tc.input.split("\\n");\n    const nums = lines[0].split(" ").map(Number);\n    const target = Number(lines[1]);\n    const res = twoSum(nums,target);\n    console.log("[" + res.join(",") + "]");\n  }\n})();',
      python:
        '{{USER_CODE}}\n\ntest_cases = {{TEST_CASES}}\nfor tc in test_cases:\n    lines = tc["input"].split("\\n")\n    nums = list(map(int, lines[0].split()))\n    target = int(lines[1])\n    res = twoSum(nums,target)\n    print("[" + ",".join(map(str,res)) + "]")',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){\n  vector<string> testInputs = { {{TEST_CASES_CPP}} };\n  for(auto &raw: testInputs){\n    stringstream ss(raw);\n    string numsLine,targetLine;\n    getline(ss,numsLine);\n    getline(ss,targetLine);\n    stringstream ns(numsLine);\n    vector<int> nums; int x;\n    while(ns>>x) nums.push_back(x);\n    int target = stoi(targetLine);\n    vector<int> res = twoSum(nums,target);\n    cout<<"[";\n    for(int i=0;i<res.size();i++){ cout<<res[i]; if(i!=res.size()-1) cout<<","; }\n    cout<<"]"<<endl;\n  }\n  return 0;\n}',
      java: 'import java.util.*;\n\npublic class Main {\n  {{USER_CODE}}\n\n  public static void main(String[] args){\n    String[] testInputs = new String[]{ {{TEST_CASES_JAVA}} };\n    for(String raw: testInputs){\n      String[] lines = raw.split("\\\\n");\n      String[] numsStr = lines[0].split(" ");\n      int[] nums = new int[numsStr.length];\n      for(int i=0;i<numsStr.length;i++) nums[i] = Integer.parseInt(numsStr[i]);\n      int target = Integer.parseInt(lines[1]);\n      int[] res = new Main().twoSum(nums,target);\n      System.out.print("[");\n      for(int i=0;i<res.length;i++){ System.out.print(res[i]); if(i!=res.length-1) System.out.print(","); }\n      System.out.println("]");\n    }\n  }\n}',
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
    boilerplates: {
      javascript:
        '{{USER_CODE}}\n\n(function(){\n  const testCases = {{TEST_CASES}};\n  for(const tc of testCases){\n    const x = Number(tc.input.trim());\n    const res = isPalindrome(x);\n    console.log(res ? "true" : "false");\n  }\n})();',
      python:
        '{{USER_CODE}}\n\ntest_cases = {{TEST_CASES}}\nfor tc in test_cases:\n    x = int(tc["input"].strip())\n    print("true" if isPalindrome(x) else "false")',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){\n  vector<string> testInputs = { {{TEST_CASES_CPP}} };\n  for(auto &raw: testInputs){\n    int x = stoi(raw);\n    cout<<(isPalindrome(x)?"true":"false")<<endl;\n  }\n  return 0;\n}',
      java: 'import java.util.*;\n\npublic class Main {\n  {{USER_CODE}}\n\n  public static void main(String[] args){\n    String[] testInputs = new String[]{ {{TEST_CASES_JAVA}} };\n    for(String raw: testInputs){\n      int x = Integer.parseInt(raw.trim());\n      System.out.println(new Main().isPalindrome(x)?"true":"false");\n    }\n  }\n}',
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
    boilerplates: {
      javascript:
        '{{USER_CODE}}\n\n(function(){\n  const testCases = {{TEST_CASES}};\n  for(const tc of testCases){\n    const strs = tc.input.split(" ");\n    console.log(longestCommonPrefix(strs));\n  }\n})();',
      python:
        '{{USER_CODE}}\n\ntest_cases = {{TEST_CASES}}\nfor tc in test_cases:\n    strs = tc["input"].split()\n    print(longestCommonPrefix(strs))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){\n  vector<string> testInputs = { {{TEST_CASES_CPP}} };\n  for(auto &raw: testInputs){\n    stringstream ss(raw);\n    vector<string> strs; string w;\n    while(ss>>w) strs.push_back(w);\n    cout<<longestCommonPrefix(strs)<<endl;\n  }\n  return 0;\n}",
      java: 'import java.util.*;\n\npublic class Main {\n  {{USER_CODE}}\n\n  public static void main(String[] args){\n    String[] testInputs = new String[]{ {{TEST_CASES_JAVA}} };\n    for(String raw: testInputs){\n      String[] strs = raw.split(" ");\n      System.out.println(new Main().longestCommonPrefix(strs));\n    }\n  }\n}',
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
    boilerplates: {
      javascript:
        '{{USER_CODE}}\n\n(function(){\n  const testCases = {{TEST_CASES}};\n  for(const tc of testCases){\n    console.log(isValid(tc.input.trim())?"true":"false");\n  }\n})();',
      python:
        '{{USER_CODE}}\n\ntest_cases = {{TEST_CASES}}\nfor tc in test_cases:\n    print("true" if isValid(tc["input"].strip()) else "false")',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){\n  vector<string> testInputs = { {{TEST_CASES_CPP}} };\n  for(auto &raw: testInputs){\n    cout<<(isValid(raw)?"true":"false")<<endl;\n  }\n  return 0;\n}',
      java: 'import java.util.*;\n\npublic class Main {\n  {{USER_CODE}}\n\n  public static void main(String[] args){\n    String[] testInputs = new String[]{ {{TEST_CASES_JAVA}} };\n    for(String raw: testInputs){\n      System.out.println(new Main().isValid(raw)?"true":"false");\n    }\n  }\n}',
    },
  },
  {
    title: "Add Two Numbers",
    description: "Add two reversed linked lists.",
    difficulty: "Medium",
    tags: ["Linked List"],
    constraints: "1 <= nodes <= 100",
    levelNumber: 5,
    examples: [{ input: "[2,4,3] + [5,6,4]", output: "708", explanation: "" }],
    testCases: [{ input: "243\n564", expectedOutput: "708", isHidden: false }],
    prototypes: {
      javascript: "function addTwoNumbers(l1,l2){\n\n}",
      python: "def addTwoNumbers(l1,l2):\n    pass",
      java: "public ListNode addTwoNumbers(ListNode l1,ListNode l2){\n\n}",
      cpp: "ListNode* addTwoNumbers(ListNode* l1,ListNode* l2){\n\n}",
    },
    boilerplates: {
      javascript:
        'class ListNode{constructor(val,next=null){this.val=val;this.next=next;}}\nfunction buildList(str){let head=null,cur=null;for(let ch of str.trim()){let node=new ListNode(Number(ch));if(!head){head=node;cur=node;}else{cur.next=node;cur=node;}}return head;}\nfunction listToString(head){let res="";while(head){res+=head.val;head=head.next;}return res;}\n\n{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){const lines=tc.input.split("\\n");const l1=buildList(lines[0]);const l2=buildList(lines[1]);const result=addTwoNumbers(l1,l2);console.log(listToString(result));}})();',
      python:
        'class ListNode:\n    def __init__(self,val=0,next=None):\n        self.val=val\n        self.next=next\n\ndef build_list(s):\n    head=None\n    cur=None\n    for ch in s.strip():\n        node=ListNode(int(ch))\n        if not head:\n            head=node\n            cur=node\n        else:\n            cur.next=node\n            cur=node\n    return head\n\ndef list_to_string(head):\n    res=""\n    while head:\n        res+=str(head.val)\n        head=head.next\n    return res\n\n{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    lines=tc["input"].split("\\n")\n    l1=build_list(lines[0])\n    l2=build_list(lines[1])\n    result=addTwoNumbers(l1,l2)\n    print(list_to_string(result))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nstruct ListNode{int val;ListNode* next;ListNode(int x):val(x),next(NULL){}};\nListNode* buildList(string s){ListNode* head=NULL;ListNode* cur=NULL;for(char ch:s){ListNode* node=new ListNode(ch-'0');if(!head){head=node;cur=node;}else{cur->next=node;cur=node;}}return head;}\nstring listToString(ListNode* head){string res=\"\";while(head){res+=to_string(head->val);head=head->next;}return res;}\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){stringstream ss(raw);string a,b;getline(ss,a);getline(ss,b);ListNode* l1=buildList(a);ListNode* l2=buildList(b);ListNode* result=addTwoNumbers(l1,l2);cout<<listToString(result)<<endl;}return 0;}",
      java: "import java.util.*;\nclass ListNode{int val;ListNode next;ListNode(int x){val=x;}}\npublic class Main{\nstatic ListNode buildList(String s){ListNode head=null,cur=null;for(char ch:s.toCharArray()){ListNode node=new ListNode(ch-'0');if(head==null){head=node;cur=node;}else{cur.next=node;cur=node;}}return head;}\nstatic String listToString(ListNode head){StringBuilder sb=new StringBuilder();while(head!=null){sb.append(head.val);head=head.next;}return sb.toString();}\n\n{{USER_CODE}}\n\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){String[] lines=raw.split(\"\\\\n\");ListNode l1=buildList(lines[0]);ListNode l2=buildList(lines[1]);ListNode result=new Main().addTwoNumbers(l1,l2);System.out.println(listToString(result));}}}",
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
    boilerplates: {
      javascript:
        "{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){console.log(lengthOfLongestSubstring(tc.input.trim()));}})();",
      python:
        '{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    print(lengthOfLongestSubstring(tc["input"].strip()))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){cout<<lengthOfLongestSubstring(raw)<<endl;}return 0;}",
      java: "import java.util.*;\npublic class Main{\n{{USER_CODE}}\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){System.out.println(new Main().lengthOfLongestSubstring(raw));}}}",
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
    boilerplates: {
      javascript:
        "{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){console.log(longestPalindrome(tc.input.trim()));}})();",
      python:
        '{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    print(longestPalindrome(tc["input"].strip()))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){cout<<longestPalindrome(raw)<<endl;}return 0;}",
      java: "import java.util.*;\npublic class Main{\n{{USER_CODE}}\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){System.out.println(new Main().longestPalindrome(raw));}}}",
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
    boilerplates: {
      javascript:
        '{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){const lines=tc.input.split("\\n");console.log(convert(lines[0],Number(lines[1])));}})();',
      python:
        '{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    lines=tc["input"].split("\\n")\n    print(convert(lines[0],int(lines[1])))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){stringstream ss(raw);string s;string r;getline(ss,s);getline(ss,r);cout<<convert(s,stoi(r))<<endl;}return 0;}",
      java: 'import java.util.*;\npublic class Main{\n{{USER_CODE}}\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){String[] lines=raw.split("\\\\n");System.out.println(new Main().convert(lines[0],Integer.parseInt(lines[1])));}}}',
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
    boilerplates: {
      javascript:
        "{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){console.log(reverse(Number(tc.input.trim())));}})();",
      python:
        '{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    print(reverse(int(tc["input"].strip())))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){cout<<reverse(stoi(raw))<<endl;}return 0;}",
      java: "import java.util.*;\npublic class Main{\n{{USER_CODE}}\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){System.out.println(new Main().reverse(Integer.parseInt(raw.trim())));}}}",
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
    boilerplates: {
      javascript:
        "{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){console.log(myAtoi(tc.input));}})();",
      python:
        '{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    print(myAtoi(tc["input"]))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){cout<<myAtoi(raw)<<endl;}return 0;}",
      java: "import java.util.*;\npublic class Main{\n{{USER_CODE}}\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){System.out.println(new Main().myAtoi(raw));}}}",
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
    boilerplates: {
      javascript:
        '{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){const lines=tc.input.split("\\n");console.log(isMatch(lines[0],lines[1])?"true":"false");}})();',
      python:
        '{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    s,p=tc["input"].split("\\n")\n    print("true" if isMatch(s,p) else "false")',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){stringstream ss(raw);string s,p;getline(ss,s);getline(ss,p);cout<<(isMatch(s,p)?"true":"false")<<endl;}return 0;}',
      java: 'import java.util.*;\npublic class Main{\n{{USER_CODE}}\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){String[] lines=raw.split("\\\\n");System.out.println(new Main().isMatch(lines[0],lines[1])?"true":"false");}}}',
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
        output: "1 1 2 3 4 4 5 6",
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
    boilerplates: {
      javascript:
        'class ListNode{constructor(val,next=null){this.val=val;this.next=next;}}\nfunction buildList(arr){let head=null,cur=null;for(let v of arr){let node=new ListNode(v);if(!head){head=node;cur=node;}else{cur.next=node;cur=node;}}return head;}\nfunction listToArray(head){let res=[];while(head){res.push(head.val);head=head.next;}return res;}\n\n{{USER_CODE}}\n\n(function(){const testCases={{TEST_CASES}};for(const tc of testCases){const groups=tc.input.split("|");let lists=[];for(let g of groups){if(g.trim()===""){lists.push(null);}else{lists.push(buildList(g.trim().split(" ").map(Number)));}}const result=mergeKLists(lists);console.log(listToArray(result).join(" "));}})();',
      python:
        'class ListNode:\n    def __init__(self,val=0,next=None):\n        self.val=val\n        self.next=next\n\ndef build_list(arr):\n    head=None\n    cur=None\n    for v in arr:\n        node=ListNode(v)\n        if not head:\n            head=node\n            cur=node\n        else:\n            cur.next=node\n            cur=node\n    return head\n\ndef list_to_array(head):\n    res=[]\n    while head:\n        res.append(head.val)\n        head=head.next\n    return res\n\n{{USER_CODE}}\n\ntest_cases={{TEST_CASES}}\nfor tc in test_cases:\n    groups=tc["input"].split("|")\n    lists=[]\n    for g in groups:\n        if g.strip()=="":\n            lists.append(None)\n        else:\n            lists.append(build_list(list(map(int,g.strip().split()))))\n    result=mergeKLists(lists)\n    print(" ".join(map(str,list_to_array(result))))',
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nstruct ListNode{int val;ListNode* next;ListNode(int x):val(x),next(NULL){}};\nListNode* buildList(vector<int>& arr){ListNode* head=NULL;ListNode* cur=NULL;for(int v:arr){ListNode* node=new ListNode(v);if(!head){head=node;cur=node;}else{cur->next=node;cur=node;}}return head;}\nvector<int> listToArray(ListNode* head){vector<int> res;while(head){res.push_back(head->val);head=head->next;}return res;}\n\n{{USER_CODE}}\n\nint main(){vector<string> testInputs={ {{TEST_CASES_CPP}} };for(auto &raw:testInputs){stringstream ss(raw);string seg;vector<ListNode*> lists;while(getline(ss,seg,'|')){stringstream ls(seg);int num;vector<int> arr;while(ls>>num) arr.push_back(num);lists.push_back(buildList(arr));}ListNode* result=mergeKLists(lists);vector<int> out=listToArray(result);for(int i=0;i<out.size();i++){cout<<out[i];if(i!=out.size()-1) cout<<\" \";}cout<<endl;}return 0;}",
      java: 'import java.util.*;\nclass ListNode{int val;ListNode next;ListNode(int x){val=x;}}\npublic class Main{\nstatic ListNode buildList(List<Integer> arr){ListNode head=null,cur=null;for(int v:arr){ListNode node=new ListNode(v);if(head==null){head=node;cur=node;}else{cur.next=node;cur=node;}}return head;}\nstatic List<Integer> listToArray(ListNode head){List<Integer> res=new ArrayList<>();while(head!=null){res.add(head.val);head=head.next;}return res;}\n\n{{USER_CODE}}\n\npublic static void main(String[] args){String[] testInputs=new String[]{ {{TEST_CASES_JAVA}} };for(String raw:testInputs){String[] groups=raw.split("\\\\|");ListNode[] lists=new ListNode[groups.length];for(int i=0;i<groups.length;i++){String g=groups[i].trim();if(g.isEmpty()){lists[i]=null;}else{String[] nums=g.split(" ");List<Integer> arr=new ArrayList<>();for(String n:nums) arr.add(Integer.parseInt(n));lists[i]=buildList(arr);}}ListNode result=new Main().mergeKLists(lists);List<Integer> out=listToArray(result);for(int i=0;i<out.size();i++){System.out.print(out.get(i));if(i!=out.size()-1) System.out.print(" ");}System.out.println();}}}',
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
