# Outstanding Issues

## Legacy IDs
We're going to have an issue with legacy IDs when carrying out migrations. ODW will already know about PINS entities with their IDs from Horizon, so in theory we have to keep IDs the same. This is difficult for a few reasons:

1. We are auto-generating integer IDs for most of our entities (all except documents). We don't know if entities on Horizon have IDs with differing types (e.g. what if cases have GUID IDs)
2. If types on Horizon use auto-generating IDs then we are potentially in big trouble. Without intervention, we'd end up with clashes unless we migrated every piece of data and then reset the auto-incrementing integer counter to the next maximum and continue from there. This would mean not creating any new entities on the back office until everything is migrated though.

Some potential solutions
1. Change types of all IDs to string, and use GUID IDs for all new entities. This is definitely not ideal.
2. Look at the Horizon IDs, figure out the max for each entity, and set a new sensible seed base for all new auto-incrementing IDs. INT type is 32 bit (signed) so we have plenty to play with.

## Scattered migration code in the API
There are cases when some additions need to be made to the API code for migration development (data mapping tweaks etc).
These have been marked with a comment prior to the change prefixed with `MigrationAddition:`. This will allow us to globally search for any occurrences and clean up tech debt at a later stage once the migration piece has been completed.

e.g.
```js
// MigrationAddition: can remove after
someMigrationCodeInTheApi()
```
## GIS Shapefiles Folder Migration (One-off)

### What & Why
This migration adds a root-level "GIS Shapefiles" folder to all existing cases that are not in DRAFT status. It is a one-time, production-safe operation to ensure all relevant projects have the required folder for GIS data. The logic is isolated for easy removal after use, minimizing risk to regular folder management code.

### How to Use
- **Create folders:**
  - Call `POST /migration/gis-shapefiles-folders` (optionally with `{ caseIds: [1,2,...], dryRun: true }` in the body for targeted or dry-run execution).
  - The response is streamed as plain text (`Transfer-Encoding: chunked`) to prevent timeouts, showing real-time progress of folders being created, skipped, or failed (processed in concurrent batches). A summary is provided at the end of the stream.
  - You can rerun the migration for failed cases by passing their IDs.
- **Delete folders:**
  - Call `POST /migration/gis-shapefiles-folders/delete` with `{ caseIds: [1,2,...], dryRun: true }` for bulk or per-case deletion (dryRun optional).
  - The response is similarly streamed progressively.

### Safe Deletion (Post-Migration)
After confirming all required folders are created and no further migration is needed, **delete the following code and routes**:

- Remove these files:
  - `apps/api/src/server/migration/migrators/gis-shapefiles-folder.controller.js`
  - `apps/api/src/server/migration/migrators/gis-shapefiles-folder.delete.controller.js`
  - `apps/api/src/server/migration/migrators/gis-shapefiles-folder.service.js`
- Remove the following lines from `apps/api/src/server/migration/migration.routes.js`:
  - `import { migrateGisShapefilesFolders } from './migrators/gis-shapefiles-folder.controller.js';`
  - `import { deleteGisShapefilesFoldersController } from './migrators/gis-shapefiles-folder.delete.controller.js';`
  - The `router.post('/gis-shapefiles-folders', ...)` and `router.post('/gis-shapefiles-folders/delete', ...)` route blocks.
- Remove the corresponding Swagger/OpenAPI documentation for these endpoints from `swagger-output.json`.
- Search for `MigrationAddition:` comments to remove any temporary migration logic.

**Important:** These endpoints directly modify the production DB. Ensure all operations are complete and validated before deleting the code.
