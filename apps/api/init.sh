#!/bin/bash
set -e

echo "Starting SSH ..."
/usr/sbin/sshd

node ./apps/api/src/server.js
