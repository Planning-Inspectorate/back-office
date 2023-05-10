#!/bin/bash

./env.sh
docker build -t my-cypress-tests .
container_id=$(docker run -d -v "$(pwd)/failed-tests:/app/cypress/screenshots" my-cypress-tests)
docker logs -f $container_id
