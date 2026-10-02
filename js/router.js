export function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean);
  return { page: parts[0] || "home", param: parts[1] || null };
}
