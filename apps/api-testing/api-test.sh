Copy code
#!/bin/bash

create_folder() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo "Folder created: $1"
  else
    echo "Folder already exists: $1"
  fi
}

create_folder "schemas"

cd ../api
echo "Generating swagger..."
npm run swagger-autogen

echo "Creating schema files and starting test..."
cd ../api-testing
npm run init-test
