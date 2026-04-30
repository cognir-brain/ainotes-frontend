export const ACCESS_TOKEN_KEY = 'access_token';
export const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || null;
export const setStoredToken = (t) => { if (t) localStorage.setItem(ACCESS_TOKEN_KEY, t); else localStorage.removeItem(ACCESS_TOKEN_KEY); };
