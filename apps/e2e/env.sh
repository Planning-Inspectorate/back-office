#!/bin/bash

if [ -f .environment ]; then
  . .environment
fi

if [ -f .env ]; then
  rm .env
fi

# Define environment variables
BASE_URL=$BASE_URL
CASE_TEAM_EMAIL=$CASE_TEAM_EMAIL
CASE_ADMIN_EMAIL=$CASE_ADMIN_EMAIL
INSPECTOR_EMAIL=$INSPECTOR_EMAIL
USER_PASSWORD=$USER_PASSWORD
APP=$APP

# Create the .env file and add the environment variables to it
echo "BASE_URL=${BASE_URL}" >> .env
echo "CASE_TEAM_EMAIL=${CASE_TEAM_EMAIL}" >> .env
echo "CASE_ADMIN_EMAIL=${CASE_ADMIN_EMAIL}" >> .env
echo "INSPECTOR_EMAIL=${INSPECTOR_EMAIL}" >> .env
echo "USER_PASSWORD=${USER_PASSWORD}" >> .env
echo "APP=${APP}" >> .env

# Optionally, you can add some comments to the .env file to document the purpose of each variable

