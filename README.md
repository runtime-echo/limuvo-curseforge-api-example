# Limuvo | CurseForge API integration

This repository describes Limuvo’s CurseForge integration for an API access request. It contains a small, isolated example of the API call used by Limuvo, not the source code for the full hosting platform.

## About Limuvo

Limuvo provides game server hosting and a management panel for customers:

https://limuvo.com/

The CurseForge integration is part of Limuvo’s hosting service. Limuvo sells hosting services, not CurseForge projects or files.

## Current integration

An authenticated Limuvo Panel customer can search the Minecraft modpack catalog. The panel’s backend sends a server-side request to the official CurseForge Core API endpoint `GET https://api.curseforge.com/v1/mods/search`, using Minecraft game ID `432` and the modpack class ID `4471`.

The panel uses the returned project ID, name, summary, download count, icon URL, and official CurseForge project URL to show search results and link customers to the project on CurseForge.

The current CurseForge integration is catalog-only. It does not download or automatically install CurseForge files. Customers who want a CurseForge pack installed currently receive installation assistance from Limuvo support.

## Intended use if API access is approved

Limuvo would like to explore adding a workflow for selecting a compatible Minecraft server-pack version and installing it on the customer’s own game server. This feature is not currently implemented for CurseForge. We will only build it after confirming that the proposed use is permitted by CurseForge’s API terms and the relevant project’s distribution settings.

Limuvo will respect CurseForge and project-author restrictions. We will not mirror or redistribute files where third-party distribution is not allowed. If a project cannot be installed through an approved third-party flow, customers will be directed to the official CurseForge page or Limuvo support instead.

The current catalog shows each project’s name and official CurseForge link. If an installation workflow is approved and implemented, Limuvo intends to show project and author attribution using the information available through the API.

## API credentials and customer data

The API key is supplied through the server-side `CURSEFORGE_API_KEY` environment variable and sent in the `x-api-key` request header. It is not included in browser code or this repository. The isolated example uses a placeholder only; no production key or customer data is present here.

## Source code scope

This private repository contains the small API example and documentation relevant to this request. Limuvo’s full hosting platform and management panel are proprietary software. Their backend, billing, provisioning, infrastructure, and customer data are not included.

## Run the example

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

Run the tests without an API key or network access:

```sh
npm test
```

## References

- [CurseForge REST API documentation](https://docs.curseforge.com/rest-api/)
- [CurseForge API key application information](https://support.curseforge.com/support/solutions/articles/9000208346)
