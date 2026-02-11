import { API_BASE } from "../../../utils/api";

export const getProblem = async (level) => {
  const url = `${API_BASE}/api/levels/${level}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }

  return res.json();
};
