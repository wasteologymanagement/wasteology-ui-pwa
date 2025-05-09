const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Get access token
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// Get refresh token
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Save tokens to localStorage
export const saveTokens = ({ accessToken, refreshToken }) => {
  // console.log("here in save token : ", { accessToken, refreshToken })
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Update tokens (useful when you receive new tokens after refreshing)
export const updateTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Remove tokens (for logout scenarios)
export const removeTokens = () => { 
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
