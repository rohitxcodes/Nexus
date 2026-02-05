require("dotenv").config();
const axios = require("axios");

const JUDGE0_KEY = process.env.RAPIDAPI_KEY;

if (!JUDGE0_KEY) {
  console.error("❌ JUDGE0_KEY is undefined");
  process.exit(1);
}

console.log("✅ Using API key:", JUDGE0_KEY);

const BASE = "https://judge0-ce.p.rapidapi.com";

async function testJudge0() {
  try {
    const submitRes = await axios.post(
      `${BASE}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: '#include <iostream>\nint main(){ std::cout<<"Hello"; }',
        language_id: 54, // C++
        stdin: "",
      },
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Judge0 response:");
    console.log(submitRes.data);
  } catch (err) {
    console.error("❌ Judge0 test failed");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testJudge0();
