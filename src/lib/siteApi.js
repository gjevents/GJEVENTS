const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, "");
let cachedCsrfToken = null;

const isGitHubProjectPages = () =>
  window.location.hostname === "gjevents.github.io" &&
  window.location.pathname.toLowerCase().startsWith("/gjevents");

const normalizePath = (path) => (path.startsWith("/") ? path : `/${path}`);

export const apiUrl = (path) => {
  const normalizedPath = normalizePath(path);
  if (apiBaseUrl) return `${apiBaseUrl}${normalizedPath}`;
  if (isGitHubProjectPages()) return `/GJEVENTS${normalizedPath}`;
  return normalizedPath;
};

export const mediaUrl = (path) => {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalizedPath = normalizePath(path);
  if (apiBaseUrl) return `${apiBaseUrl}${normalizedPath}`;
  if (isGitHubProjectPages()) return `/GJEVENTS${normalizedPath}`;
  return normalizedPath;
};

export const apiCredentials = apiBaseUrl ? "include" : "same-origin";

const csrfTokenFromCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
};

export const getCsrfToken = async () => {
  const cookieToken = csrfTokenFromCookie();
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
    return cookieToken;
  }

  if (cachedCsrfToken) return cachedCsrfToken;

  const response = await fetch(apiUrl("/api/csrf/"), {
    credentials: apiCredentials,
    headers: { Accept: "application/json" },
  });

  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error(`CSRF request failed with HTTP ${response.status}. The backend returned a non-JSON response.`);
    }
  }

  if (!response.ok || !payload.csrfToken) {
    throw new Error(payload.error || `CSRF request failed with HTTP ${response.status}.`);
  }

  cachedCsrfToken = payload.csrfToken;
  return cachedCsrfToken;
};

export const csrfHeaders = async () => {
  const token = await getCsrfToken();
  return token ? { "X-CSRFToken": token } : {};
};

export const parseApiResponse = async (response, fallbackMessage = "The gallery backend returned an unexpected response.") => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    const targetUrl = response.url || "unknown API URL";
    throw new Error(`${fallbackMessage} URL: ${targetUrl}. HTTP status: ${response.status}.`);
  }
};
