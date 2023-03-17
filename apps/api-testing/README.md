`
# API Test Framework README

## Introduction
This framework uses [Supertest](https://github.com/visionmedia/supertest), [Mocha](https://mochajs.org/), and [Ajv](https://ajv.js.org/) for schema validation. 

## Getting started
To get started with the API test framework, follow these steps:
1. Install the required dependencies by running `npm install` from the root of the Back Office project.
2. Run the shell script by typing `./test.sh\`. or run `npm run api:test` from the root for the Back Office project.
5. Create a `.env` file in `apps/api-testing` directory.
6. Add a `BASE_URL` variable to the `.env` file. The value should be the URL of the API being tested (e.g. \`BASE_URL=https://api.test.com/\`).
**Note:** This will default to `localhost:3000` if the file or env variable is not available. If the tests are run against a local server, make sure the database is up, and server is running on localhost:3000.

## Functionality
The shell script `test.sh` performs the following functions:
1. It creates a `schemas` folder if it doesn't exist already.
2. It generates Swagger documentation using the `swagger-autogen` npm package.
3. It creates schema files for testing using the `init-test` npm script.
