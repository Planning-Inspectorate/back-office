#!/usr/bin/env bash
set -euo pipefail

# Defaults
SPEC_LIST=""
SPEC_GLOB="cypress/e2e/back-office-applications/**/*.spec.js"
SHARD_INDEX=${SHARD_INDEX:-}
SHARD_COUNT=${SHARD_COUNT:-}

# Parse named arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --spec)
      SPEC_LIST="$2"
      shift 2
      ;;
    --glob)
      SPEC_GLOB="$2"
      shift 2
      ;;
    --shard-index)
      SHARD_INDEX="$2"
      shift 2
      ;;
    --shard-count)
      SHARD_COUNT="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

npx cypress verify

# If no explicit spec list provided, discover using glob
if [[ -z "$SPEC_LIST" ]]; then
  # Collect matching spec files relative to repo (workingDirectory should be apps/e2e)
  # Use find for consistent behavior and sort for determinism
  mapfile -t ALL_SPECS < <(find ${SPEC_GLOB%/*} -type f -name "${SPEC_GLOB##*/}" | sort)

  if [[ ${#ALL_SPECS[@]} -eq 0 ]]; then
    echo "No spec files found for glob: $SPEC_GLOB" >&2
    exit 0
  fi

  # If sharding requested, select a subset
  if [[ -n "${SHARD_INDEX}" && -n "${SHARD_COUNT}" ]]; then
    if ! [[ "$SHARD_INDEX" =~ ^[0-9]+$ && "$SHARD_COUNT" =~ ^[0-9]+$ ]]; then
      echo "SHARD_INDEX and SHARD_COUNT must be integers" >&2
      exit 2
    fi
    if [[ "$SHARD_INDEX" -ge "$SHARD_COUNT" ]]; then
      echo "SHARD_INDEX ($SHARD_INDEX) must be less than SHARD_COUNT ($SHARD_COUNT)" >&2
      exit 2
    fi

    SELECTED_SPECS=()
    for i in "${!ALL_SPECS[@]}"; do
      if (( i % SHARD_COUNT == SHARD_INDEX )); then
        SELECTED_SPECS+=("${ALL_SPECS[$i]}")
      fi
    done

    if [[ ${#SELECTED_SPECS[@]} -eq 0 ]]; then
      echo "No specs selected for shard $SHARD_INDEX/$SHARD_COUNT (glob: $SPEC_GLOB). Exiting." >&2
      exit 0
    fi

    # Join with commas for Cypress --spec
    SPEC_LIST=$(printf ",%s" "${SELECTED_SPECS[@]}")
    SPEC_LIST=${SPEC_LIST:1}
  else
    # No sharding: run all
    SPEC_LIST=$(printf ",%s" "${ALL_SPECS[@]}")
    SPEC_LIST=${SPEC_LIST:1}
  fi
fi

echo "Running specs (${SHARD_INDEX:-all}/${SHARD_COUNT:-all}) with glob '${SPEC_GLOB}':"
echo "$SPEC_LIST"

npx cypress run --spec "$SPEC_LIST"
