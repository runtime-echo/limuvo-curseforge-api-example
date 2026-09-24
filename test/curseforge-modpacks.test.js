import test from "node:test";
import assert from "node:assert/strict";
import { searchCurseForgeModpacks } from "../src/curseforge-modpacks.js";

test("searches Minecraft modpacks with the API key in a server-side header and maps safe fields", async () => {
  let requestedUrl;
  let requestedOptions;
  const results = await searchCurseForgeModpacks("  RLCraft  ", {
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      requestedUrl = new URL(url);
      requestedOptions = options;
      return Response.json({ data: [
        { id: 285109, name: "RLCraft", summary: "A pack", downloadCount: 123, logo: { url: "https://media.forgecdn.net/icon.png" }, links: { websiteUrl: "https://www.curseforge.com/minecraft/modpacks/rlcraft" } },
        { id: 2, name: "Unsafe", links: { websiteUrl: "https://evil.example/" } },
      ] });
    },
  });

  assert.equal(requestedUrl.origin + requestedUrl.pathname, "https://api.curseforge.com/v1/mods/search");
  assert.equal(requestedUrl.searchParams.get("gameId"), "432");
  assert.equal(requestedUrl.searchParams.get("classId"), "4471");
  assert.equal(requestedUrl.searchParams.get("searchFilter"), "RLCraft");
  assert.equal(requestedOptions.headers["x-api-key"], "test-key");
  assert.deepEqual(results, [{
    projectId: "285109", title: "RLCraft", description: "A pack", downloads: 123,
    iconUrl: "https://media.forgecdn.net/icon.png",
    websiteUrl: "https://www.curseforge.com/minecraft/modpacks/rlcraft",
  }]);
});

test("requires a key and bounds the search query", async () => {
  await assert.rejects(searchCurseForgeModpacks("test", { apiKey: "" }), /CURSEFORGE_API_KEY/);
  await assert.rejects(searchCurseForgeModpacks("x".repeat(101), { apiKey: "test" }), /100 characters/);
});
