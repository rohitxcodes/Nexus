const TOKEN_KEY = "token";

// Save token after login
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
// Read token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
// Remove token (logout)
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};
