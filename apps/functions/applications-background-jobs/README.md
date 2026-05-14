# Applications Background Jobs

## Purpose

This function app handles asynchronous background workflows for document processing and publication in Back Office applications.

This README defines a detailed plan to evolve the current GIS shapefile flow into an extensible geospatial ingestion pipeline that supports `.zip` shapefiles today and `.gpkg` (GeoPackage) and other formats later.

## Current State

### Current geospatial flow (today)

1. User uploads geospatial source file to blob storage.
2. Antivirus scan result triggers `malware-detected` (Event Grid).
3. `malware-detected` updates document state via API.
4. If routing checks pass (clean scan, GIS type, non-GeoJSON event), message is sent to shapefile processing queue.
5. `process-shapefile` reads source, converts to GeoJSON, uploads generated file, and creates version metadata.

### Current constraints

- Routing logic is currently centered on shapefile ZIP assumptions.
- Queue payload and processor behavior are tightly coupled to ZIP shapefile conventions.
- Extension to new source formats requires touching multiple places.

## Target State

Build a format-agnostic geospatial pipeline based on explicit source type and modular processing adapters.

### Goals

- Support `.zip` and `.gpkg` with minimal duplicate logic.
- Keep malware detection focused on scan/state handling.
- Make routing policy explicit, testable, and extensible.
- Preserve reliability and idempotency under retries.
- Keep backward compatibility for existing ZIP-based flows.

### Non-goals

- No broad rewrite of unrelated document pipelines.
- No immediate support for all geospatial formats.
- No user-facing workflow changes unless required by validation.

## Architecture Plan

### 1. Domain model: source type

Introduce an explicit geospatial source type contract.

Suggested values:

- `shapefile_zip`
- `gpkg`

Future values can be added as needed.

Recommended ownership:

- Source type is set once at ingestion (upload/API layer).
- Source type is carried in DB metadata and queue payloads.
- Processors branch by source type, not by filename heuristics.

### 2. Malware-detected as orchestrator

Keep `malware-detected` responsible for:

- validating event input
- handling HTML safety checks
- mapping scan result to document published status
- updating state via API
- delegating routing to a generic post-scan router

Do not place source-format parsing or conversion logic in this function.

### 3. Generic post-scan router

Evolve routing into a format-aware policy module.

Inputs:

- `publishedStatus`
- `document metadata` (document type, source type, URI, filename)
- `event blob URI`

Outputs:

- `enqueue: boolean`
- `target queue/topic`
- `reason code`

Example reason codes:

- `scan_not_clean`
- `not_geospatial_document`
- `unsupported_source_type`
- `missing_source_uri`
- `already_generated_event`

### 4. Stable queue envelope

Use one queue message shape for all geospatial processors.

```json
{
  "documentId": "guid",
  "caseId": 123,
  "caseRef": "BC0110001",
  "sourceType": "shapefile_zip",
  "sourceUri": "https://...",
  "originalFilename": "example.zip",
  "dateCreated": "2026-05-14T16:29:58.221Z",
  "correlationId": "event-id"
}
```

Rules:

- `sourceType` is mandatory.
- `sourceUri` must point to scanned source file.
- include a correlation id for tracing.

### 5. Processor adapters

Refactor processing into shared pipeline + source-specific adapters.

Shared steps:

1. Load source file.
2. Parse and normalize features.
3. Convert to GeoJSON output.
4. Write GeoJSON to blob.
5. Persist `DocumentVersion` update/create.
6. Emit activity log and status transitions.

Adapters:

- `shapefileZipAdapter`
- `gpkgAdapter`

This keeps parser differences isolated while reusing persistence and output behavior.

### 6. Security model

Preferred model:

- Raw upload lands in quarantine/source area.
- Antivirus scan completes.
- Only clean source is routed for transformation.

Important:

- Generated GeoJSON artifacts should never recursively trigger source re-processing.
- Keep event loop guard checks in router policy.

### 7. Idempotency and retry safety

Requirements:

- Processing retries must not create duplicate target versions.
- Use a deterministic idempotency key, for example:
  - `documentGuid + targetFormat + sourceVersion`
- Upsert behavior in DB for generated artifact metadata.
- Safe handling of duplicate queue deliveries.

### 8. Observability

Standard structured log fields:

- `correlationId`
- `eventId`
- `documentId`
- `caseId`
- `caseRef`
- `sourceType`
- `routeDecision`
- `routeReason`
- `processor`
- `durationMs`

Metrics to add:

- routed geospatial messages by source type
- success/failure by source type
- average processing duration by source type
- retry count / dead-letter count

## API and Data Contract Plan

## API responsibilities

1. Determine and validate `sourceType` at upload/create-document time.
2. Persist `sourceType` with document version metadata.
3. Return `sourceType` to downstream callers so routing does not guess from extension.

## Data model updates

Suggested additions to document version metadata:

- `sourceType` (nullable during migration, required for new records)
- optional `sourceMime`
- optional `sourceChecksum`

Migration strategy:

1. Add nullable columns.
2. Backfill known ZIP records with `shapefile_zip` where safe.
3. Make required for new writes in API validation.
4. Consider hard requirement after data backfill confidence.

## Validation rules

- If document type is GIS geospatial, `sourceType` must be present.
- Allowed source types are explicit enum values.
- Source filename and MIME must align with source type policy.

## Implementation Phases

### Phase 1: Foundation (no behavior change)

- Add source type constants and queue payload field support.
- Keep current ZIP behavior unchanged by default.
- Add router interfaces and reason-code enums.
- Add tests proving parity with current behavior.

Exit criteria:

- Existing malware-detected and process-shapefile tests pass.
- No production behavior change for ZIP flow.

### Phase 2: Generic routing

- Introduce post-scan router module.
- Route by source type.
- Keep loop-guard behavior.
- Improve structured logging.

Exit criteria:

- Routing tests cover ZIP clean/malicious/invalid cases.
- No regressions in existing GIS ZIP processing.

### Phase 3: Processor modularization

- Split conversion pipeline into shared core + adapters.
- Keep shapefile ZIP adapter as first implementation.
- Add adapter contract tests.

Exit criteria:

- ZIP adapter parity confirmed.
- Shared pipeline unit tests in place.

### Phase 4: GPKG enablement

- Implement `gpkgAdapter`.
- Enable routing for `gpkg` behind feature flag.
- Add negative tests for unsupported/invalid GeoPackage files.

Exit criteria:

- GPKG test fixtures pass.
- End-to-end clean GPKG upload produces GeoJSON and metadata updates.

### Phase 5: Hardening and rollout

- Enable in dev, then test, then prod with controlled flag rollout.
- Monitor metrics and dead-letter queue.
- Run rollback if thresholds are exceeded.

Exit criteria:

- Stable success rate and processing duration.
- No duplicate output versions due to retries.

## Testing Strategy

### Unit tests

- Router decisions by source type and scan status.
- Adapter parsing and normalization tests.
- Idempotency key generation tests.

### Integration tests

- malware event to queue message contract.
- queue message to generated GeoJSON metadata persistence.

### End-to-end tests

- ZIP happy path.
- GPKG happy path.
- malicious scan path (must not route).
- duplicate event delivery path.

### Regression tests

- GeoJSON event loop guard.
- missing source URI fallback logic.
- deleted-document rename interactions unaffected.

## Operational Runbook Additions

For incidents, quickly answer:

1. Was malware scan clean?
2. What was source type?
3. Did router enqueue or skip (and why)?
4. Which queue was targeted?
5. Did processor complete and write version metadata?
6. Was any retry or dead-letter triggered?

Recommended troubleshooting queries and logs should be documented in app runbook files after implementation.

## Risks and Mitigations

Risk: Source type missing on older records.
Mitigation: Backfill strategy and safe fallback logic for legacy records.

Risk: Retry duplicates generated outputs.
Mitigation: deterministic idempotency key and DB upsert semantics.

Risk: New adapter impacts current ZIP performance.
Mitigation: isolate adapters, benchmark, and keep feature flags.

Risk: Event recursion from generated files.
Mitigation: explicit generated-file loop guards in router policy.

## Design Principles Applied

- SOLID: Separate orchestrator, router policy, and source adapters.
- DRY: Shared queue envelope, shared processing pipeline, shared logging schema.
- KISS: Start with two source types and clear contracts.
- YAGNI: Introduce only required abstractions for ZIP and GPKG, not a full plugin platform yet.

## Suggested Next Concrete Tasks

1. Add source type constants and types in shared `common/constants.js`.
2. Add `sourceType` to API response used by `malware-detected`.
3. Replace shapefile-only router naming with generic post-scan router.
4. Define and validate queue payload contract with `sourceType`.
5. Split `process-shapefile` into shared pipeline and ZIP adapter.
6. Add feature-flagged GPKG adapter and fixtures.
7. Add dashboards/alerts for route reason and processing failures by source type.

## Ownership

- API team: source type validation and persistence.
- Background jobs team: routing, queue contract, processors.
- Platform/operations: telemetry, alerting, and rollout controls.

## Definition of Done

- ZIP flow unchanged and fully green.
- GPKG clean files process end-to-end in dev/test.
- malware-detected remains format-agnostic orchestration only.
- processor supports source-specific adapters through a stable contract.
- operational metrics and runbook updates are complete.
