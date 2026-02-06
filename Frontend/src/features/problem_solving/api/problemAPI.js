export const getProblem = async (level) => {
  const url = `${import.meta.env.VITE_LEVEL_API_URL}/${level}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }

  return res.json();
};
