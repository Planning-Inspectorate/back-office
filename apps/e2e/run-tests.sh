#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: run-tests.sh [--spec ",comma,separated,paths"] [--glob "pattern"] [--shard-index N --shard-count M]

Options:
  --spec           Comma-separated list of spec files to run (overrides --glob)
  --glob           Glob pattern for test discovery (default: cypress/e2e/back-office-applications/**/*.spec.js)
  --shard-index    Zero-based shard index for parallelization
  --shard-count    Total number of shards

Examples:
  ./run-tests.sh --glob "cypress/e2e/back-office-applications/**/*.spec.js" --shard-index 0 --shard-count 4
  ./run-tests.sh --spec "cypress/e2e/foo.spec.js,cypress/e2e/bar.spec.js"
EOF
}

# Defaults
SPEC_LIST=""
SPEC_GLOB="cypress/e2e/back-office-applications/**/*.spec.js"
SHARD_INDEX=${SHARD_INDEX:-}
SHARD_COUNT=${SHARD_COUNT:-}

# Parse named arguments
while [[ $# -gt 0 ]]; do # Checks the count of positional parameters. As long as there’s at least one argument left, keep parsing.
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --spec)
      SPEC_LIST="$2" # assigns the value that follows the flag.
      shift 2 #shift 2: removes the flag and its value from the positional parameters so the loop advances.
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
    *) # prints an error to stderr 
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

npx cypress verify

# If no explicit spec list provided, discover using glob (bash globstar) and shard by contiguous slice
if [[ -z "$SPEC_LIST" ]]; then
  shopt -s nullglob globstar

  # Expand glob to array via compgen and sort deterministically
  mapfile -t ALL_SPECS < <(compgen -G "$SPEC_GLOB" | sort)
  if (( ${#ALL_SPECS[@]} == 0 )); then
    echo "No spec files found for glob: $SPEC_GLOB" >&2
    exit 0
  fi

  if [[ -n "${SHARD_INDEX}" && -n "${SHARD_COUNT}" ]]; then
    if ! [[ "$SHARD_INDEX" =~ ^[0-9]+$ && "$SHARD_COUNT" =~ ^[0-9]+$ ]]; then
      echo "SHARD_INDEX and SHARD_COUNT must be integers" >&2
      exit 2
    fi
    if [[ "$SHARD_INDEX" -ge "$SHARD_COUNT" ]]; then
      echo "SHARD_INDEX ($SHARD_INDEX) must be less than SHARD_COUNT ($SHARD_COUNT)" >&2
      exit 2
    fi

    total=${#ALL_SPECS[@]}
    start=$(( SHARD_INDEX * total / SHARD_COUNT ))
    end=$(( (SHARD_INDEX + 1) * total / SHARD_COUNT ))
    count=$(( end - start ))

    if (( count <= 0 )); then
      echo "No specs selected for shard $SHARD_INDEX/$SHARD_COUNT (glob: $SPEC_GLOB). Exiting." >&2
      exit 0
    fi

    SELECTED_SPECS=("${ALL_SPECS[@]:start:count}")

    # Join with commas preserving spaces
    SPEC_LIST=$(printf '%s,' "${SELECTED_SPECS[@]}")
    SPEC_LIST=${SPEC_LIST%,}
  else
    SPEC_LIST=$(printf '%s,' "${ALL_SPECS[@]}")
    SPEC_LIST=${SPEC_LIST%,}
  fi
fi

echo "Running specs (${SHARD_INDEX:-all}/${SHARD_COUNT:-all}) with glob '${SPEC_GLOB}':"
echo "$SPEC_LIST"

npx cypress run --spec "$SPEC_LIST"
