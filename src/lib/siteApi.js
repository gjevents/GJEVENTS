const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://gjevents-backend.onrender.com";

export const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, "");

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

export const csrfHeaders = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));

  return cookie ? { "X-CSRFToken": decodeURIComponent(cookie.split("=")[1]) } : {};
};
