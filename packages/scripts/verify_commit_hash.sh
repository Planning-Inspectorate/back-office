#!/bin/bash

# Function to check the /health endpoint with retries
verify_commit_hash() {
  service_name=$1
  service_url=$2
  build_commit=$3
  max_attempts=$4
  sleep_time=50

  if [ -z "$max_attempts" ]; then
    max_attempts=5
  fi

  attempt=1

  while [ $attempt -le $max_attempts ]; do
    echo "Waiting for $service_name to start..."
    sleep $sleep_time
    echo "Calling $service_name /health endpoint (Attempt $attempt/$max_attempts)"
    echo "Service URL: $service_url"

    # Get both the HTTP response and the status code
    response=$(curl -s -w "\n%{http_code}" $service_url || echo "error")
    http_status=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    # Log the full response and status code for debugging
    echo "HTTP Status Code: $http_status"
    echo "Response Body: $body"

    if [[ "$http_status" == "200" ]]; then
      commit=$(echo "$body" | grep -o '"commit":"[^"]*"' | sed 's/"commit":"\([^"]*\)"/\1/')
      if [[ "$commit" == "$build_commit" ]]; then
        echo "$service_name commit hash matches: $commit"
        return 0
      else
        echo "$service_name commit hash mismatch. Health: $commit, Build: $build_commit"
      fi
    else
      echo "$service_name /health check failed with status code: $http_status. Retrying in $sleep_time seconds..."
    fi

    sleep $sleep_time
    attempt=$((attempt+1))
  done

  echo "$service_name /health check failed after $max_attempts attempts"
  return 1
}

service=$1
url=$2
commit=$3
retries=$4

verify_commit_hash $service $url $commit $retries
