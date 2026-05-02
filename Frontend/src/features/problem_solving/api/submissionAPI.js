import { API_BASE } from "../../../utils/api";

export const createSubmission = async ({ levelNumber, language, code }) => {
  const res = await fetch(`${API_BASE}/api/submissions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ levelNumber, language, code }),
  });

  if (!res.ok) {
    let errorBody = null;

    try {
      errorBody = await res.json();
    } catch {
      errorBody = null;
    }

    const error = new Error(errorBody?.message || "Submission failed");
    error.status = res.status;
    error.retryAfterMs = errorBody?.retryAfterMs;
    error.tier = errorBody?.tier;
    error.limit = errorBody?.limit;
    error.current = errorBody?.current;
    throw error;
  }

  return res.json();
};

export const getSubmissionResult = async (submissionId) => {
  const res = await fetch(`${API_BASE}/api/submissions/${submissionId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Result fetch failed");
  }

  return res.json();
};
