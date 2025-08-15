#!/bin/bash

npx cypress verify

# Parse named arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --spec)
      SPEC_LIST="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

echo "Running specs: $SPEC_LIST"

npx cypress run --spec "$SPEC_LIST"
