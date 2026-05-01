const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL =
  process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";

async function createChatCompletion({
  messages = [],
  model = "gpt-3.5-turbo",
  max_tokens = 600,
  temperature = 0.2,
} = {}) {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const payload = {
    model,
    messages,
    max_tokens,
    temperature,
  };

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid response from OpenAI");
  }

  if (!res.ok) {
    const errMsg = data?.error?.message || `OpenAI API error: ${res.status}`;
    const e = new Error(errMsg);
    e.raw = data;
    throw e;
  }

  return data;
}

module.exports = {
  createChatCompletion,
};
