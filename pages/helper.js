// pages/helpers.js
// Helper pour les pages SSR
const getAuth = (req) => {
  const token = req.cookies?.token;
  return token ? `Bearer ${token}` : null;
};

const apiGet = async (url, auth, fallback = []) => {
  try {
    const res = await fetch(url, { headers: { Authorization: auth } });
    return res.ok ? await res.json() : fallback;
  } catch {
    return fallback;
  }
};

const apiCall = async (url, method, auth, body) => {
  const opts = { method, headers: { Authorization: auth } };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  return fetch(url, opts);
};

module.exports = { getAuth, apiGet, apiCall };