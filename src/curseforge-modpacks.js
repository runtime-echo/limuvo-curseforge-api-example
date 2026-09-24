import { pathToFileURL } from "node:url";

const API_URL = "https://api.curseforge.com/v1/mods/search";
const MAX_QUERY_LENGTH = 100;
const ALLOWED_SITE_HOSTS = new Set(["curseforge.com", "www.curseforge.com"]);
const ALLOWED_ICON_HOSTS = new Set(["media.forgecdn.net", "mediafilez.forgecdn.net"]);

function safeHttpsUrl(value, allowedHosts) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || !allowedHosts.has(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

function mapModpack(item) {
  if (!item || !Number.isSafeInteger(item.id) || item.id < 1 || typeof item.name !== "string") return null;
  const websiteUrl = safeHttpsUrl(item.links?.websiteUrl, ALLOWED_SITE_HOSTS);
  if (!websiteUrl) return null;
  return {
    projectId: String(item.id),
    title: item.name,
    description: typeof item.summary === "string" ? item.summary : "",
    downloads: typeof item.downloadCount === "number" && item.downloadCount >= 0 ? Math.floor(item.downloadCount) : 0,
    iconUrl: safeHttpsUrl(item.logo?.url, ALLOWED_ICON_HOSTS),
    websiteUrl,
  };
}

export async function searchCurseForgeModpacks(query, {
  apiKey = process.env.CURSEFORGE_API_KEY,
  fetchImpl = fetch,
} = {}) {
  if (typeof apiKey !== "string" || !apiKey.trim()) throw new Error("CURSEFORGE_API_KEY is required");
  if (typeof query !== "string" || query.length > MAX_QUERY_LENGTH) throw new Error("Search query must be at most 100 characters");

  const url = new URL(API_URL);
  url.search = new URLSearchParams({
    gameId: "432",
    classId: "4471",
    pageSize: "50",
    sortField: "6",
    sortOrder: "desc",
    searchFilter: query.trim(),
  }).toString();

  const response = await fetchImpl(url, {
    headers: { Accept: "application/json", "x-api-key": apiKey },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`CurseForge API request failed (${response.status})`);

  const body = await response.json();
  if (!body || !Array.isArray(body.data)) throw new Error("CurseForge API returned an invalid response");
  return body.data.map(mapModpack).filter(Boolean);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const query = process.argv.slice(2).join(" ");
  searchCurseForgeModpacks(query)
    .then((results) => console.log(JSON.stringify(results, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
