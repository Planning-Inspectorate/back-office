#!/bin/bash

./env.sh
docker build -t my-cypress-tests .
docker run -it -v "$(pwd)/failed-tests:/app/cypress/screenshots" --env-file .env my-cypress-tests
