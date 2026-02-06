const BASE = "http://localhost:3000/api/submissions";

export const createSubmission = async ({ levelNumber, language, code }) => {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ levelNumber, language, code }),
  });

  if (!res.ok) {
    throw new Error("Submission failed");
  }

  return res.json();
};

export const getSubmissionResult = async (submissionId) => {
  const res = await fetch(`${BASE}/${submissionId}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Result fetch failed");
  }
  return res.json();
};
