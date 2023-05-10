#!/bin/bash

# ./env.sh
# docker build -t my-cypress-tests .
docker run -d -v "$(pwd)/failed-tests:/app/cypress/screenshots" my-cypress-tests
