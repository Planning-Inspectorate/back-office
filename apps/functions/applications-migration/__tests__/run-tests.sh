#!/bin/bash

DEPENDENT_CONTAINER="back-office-api_migration-testing"
TARGET_CONTAINER="applications-migration-functions_migration-testing"

while [ "$(docker inspect --format='{{.State.Health.Status}}' $DEPENDENT_CONTAINER)" != "healthy" ]; do
  echo "Waiting for $DEPENDENT_CONTAINER to be healthy..."
  sleep 5
done

echo "$DEPENDENT_CONTAINER is healthy! Starting $TARGET_CONTAINER..."

docker start -a $TARGET_CONTAINER
