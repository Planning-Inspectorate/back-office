#!/bin/bash

npx cypress verify

# Accept comma-separated spec list as first argument
SPEC_LIST=$1

echo "Running specs: $SPEC_LIST"

npx cypress run --spec "$SPEC_LIST"
