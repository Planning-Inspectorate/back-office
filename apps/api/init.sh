#!/bin/bash
set -e

echo "Starting SSH ..."
service ssh start

node ./apps/api/src/server.js
