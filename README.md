# Limuvo | CurseForge API integration example

This repository contains a small, isolated example of how Limuvo uses the official CurseForge Core API to search Minecraft modpacks.

## What the integration does

- Sends a server-side `GET` request to `https://api.curseforge.com/v1/mods/search`.
- Authenticates with the `x-api-key` request header. The key is read from `CURSEFORGE_API_KEY` and must never be exposed in browser code or committed to Git.
- Searches Minecraft modpacks (`gameId=432`, `classId=4471`), returning up to 50 results sorted by downloads.
- Uses only the project ID, name, summary, download count, icon URL, and official CurseForge project URL.
- Links users to CurseForge for the pack. This example does not download or redistribute mod files, and does not automatically install CurseForge packs.

In Limuvo Panel, this functionality is called by an authenticated backend route. The browser never receives the API key. The wider panel, customer data, billing, provisioning, and infrastructure code are intentionally not part of this repository.

## Run

Requires Node.js 20 or later.

```sh
export CURSEFORGE_API_KEY="your-key"
node src/curseforge-modpacks.js "RLCraft"
```

PowerShell:

```powershell
$env:CURSEFORGE_API_KEY = "your-key"
node .\src\curseforge-modpacks.js "RLCraft"
```

Run tests without an API key or network access:

```sh
npm test
```

## Official references

- [CurseForge REST API documentation](https://docs.curseforge.com/rest-api/)
- [CurseForge API key application information](https://support.curseforge.com/support/solutions/articles/9000208346)
