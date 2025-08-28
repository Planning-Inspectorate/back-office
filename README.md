# Planning Inspectorate Back Office

This is the Planning Inspectorate Back Office monorepo that contains all the apps for running the back office. 

The back office system contains the applications back office features, including a JSON API which retrieves data from a database, and a web front-end (utilising [server-side rendering](https://web.dev/rendering-on-the-web/#server-rendering)). There are also some [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) for background tasks (such as virus scans), [Azure Blob Storage](https://azure.microsoft.com/en-gb/products/storage/blobs) is used for documents, and [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) for integration.

Most of the apps are built with [Express.js](https://expressjs.com/), and the front-end uses the [Nunjucks templating language](https://mozilla.github.io/nunjucks/templating.html) and the [GOV.UK Design System](https://design-system.service.gov.uk/).

- [Getting Started](#getting-started)
- [Tests](#tests)
- [API Documentation](#api-documentation)
- [Style Guide](#style-guide)
- [Architechture diagrams](#architecture)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) LTS & NPM (Ensure that NPM is installed globally)
* [Docker](https://www.docker.com/products/docker-desktop) (to run a local db)

### Node.js

The current node version can be found in the package.json at the root of the project. It is recommended to use a node version manager, such as [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

Example node installation, using `nvm`: 

```
nvm install 20.11.1
nvm use 20.11.1
nvm alias default 20
```

### Database Setup

#### Database Server Setup

Use Docker to run an instance of SQL Server, replace "<YourStrong@Passw0rd>":

```shell
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=<YourStrong@Passw0rd>" -p 1433:1433 --name pins_sql_server --hostname pins_sql_server -d mcr.microsoft.com/mssql/server:2019-CU27-ubuntu-20.04
```

**Note:** `SA_PASSWORD` must meet the complexity requirements: at least 8 characters including uppercase, lowercase letters, base-10 digits and/or non-alphanumeric symbols. (see [Microsoft SQL Server - Ubuntu based images](https://hub.docker.com/_/microsoft-mssql-server)).

**Notes for M1 Macs**

For M1 Macs until [this issue](https://github.com/microsoft/mssql-docker/issues/668) gets resolved you should use the following instructions, or as an alternative you can use [colima](https://github.com/abiosoft/colima) instead of Docker.

Additionally, SQL Client tools are not included in the sql-edge image for ARM64, so you won't be able to use sqlcmd from with the container. One workaround for this is to use the mcr.microsoft.com/mssql-tools docker image. You can run this temporarily in another container and connect to your `pins_sql_server` container by name if they are on the same network. Firstly, create a network:

```shell
docker network create -d bridge db_network
```

Then, start your `pins_sql_server` container in that same network

```shell
docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>' -p 1433:1433 --name pins_sql_server --network db_network -d mcr.microsoft.com/azure-sql-edge
```

Later on, when connecting to the database, follow the instructions for ARM64.

#### Database Setup

1. Connect to the container

```shell
docker exec -it pins_sql_server "bash"
```

or use the Docker Desktop Terminal tab for the container.

2. Start `sqlcmd`

Sqlcmd is a SQL command-line utility that enables interaction with SQL Server instances.  It is installed as part of the SQL Server instance in your Docker container.

```shell
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<YourStrong@Passw0rd>"
```

3. Create the database

```sql
CREATE DATABASE pins_development
GO
exit
```

> [!IMPORTANT]
> If setting up both Applications and Appeals back offices locally, it is recommended to create 2 separate databases, so they can be referenced independently.

**Notes for M1 Macs**

Replace steps 1 and 2 with:

Instead of connecting to the pins_sql_server interactive shell, run the mssql-tools image as a container and connect to the pins_sql_server host like so (this requires that your pins_sql_server container is running on the network you created):

```shell
docker run --network db_network -it mcr.microsoft.com/mssql-tools
```

Run `sqlcmd`:

```shell
sqlcmd -S pins_sql_server -U SA -P "<YourStrong@Passw0rd>"
```

##### Azure Data Studio

Another alternative is to use [Azure Data Studio](https://learn.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio) as a database client, to create and monitor the database contents.

Install Azure Data Studio, and after setting up the database in Docker as described above, connect to it by using the credentials specified in the connection string in your API .env file. It should be like this:

**Server:** localhost, 1433
**Authentication type:** SQL Login
**User name:** sa
**Password:** <YourStrong@Password>
**Database:** pins_development
**Trust server certificate:** True


#### Environment Setup
> [!IMPORTANT]
> The following guide is specific to the development of the Applications Back Office. If setting-up the Appeals Back Office, please refer to the separate appeals repository.

The `api` app needs to know how to connect to the database. Copy the `.env.example` to `.env` in `apps/api` and replace `<YourStrong@Passw0rd>` in `DATABASE_URL`.

```
DATABASE_URL="sqlserver://0.0.0.0:1433;database=pins_development;user=sa;password=<YourStrong@Passw0rd>;trustServerCertificate=true"
```

#### Schema & Seed Data
> [!IMPORTANT]
> The following guide is specific to the development of the Applications Back Office. If setting-up the Appeals Back Office, please refer to the separate appeals repository.

1. First setup the database schema

```shell
apps/api> npm run db:migrate
```

2. Next add the seed data

```shell
apps/api> npm run db:seed
```

### Troubleshooting

You may need to use a terminal running in Admin mode to install dependencies. This is not possible using VS Code on a Windows machine. In this case, open a Git Bash terminal in Admin mode then run `npm i`.

### Service Bus Schema from the data-model repo

Back Office broadcasts Service Bus event messages to the Azure Service bus most CRUD actions.  The schemas are in the shared repo data-model.
 If you identify that the schemas held locally in the root node_modules/pins-data-model/schemas folder are out of date:

1. Identify the latest tagged release in the data-model repo, e.g. "#1.0.1", from here:
[data-model tags](https://github.com/Planning-Inspectorate/data-model/tags)


2. Manually update the version string for the @planning-inspectorate/data-model dependency in the root package.json to match the latest tagged release e.g.

```
"@planning-inspectorate/data-model": "^1.0.1"
```

3. Run `npm i` from the root of the repo to install the latest version of the data-model dependency.

### Dummy User Data

When running locally there is a DUMMY_USER_DATA flag that allows the application to read in some dummy user data in the form of a dummy_user_data.json file.

```shell
const dummyUserDataFile = path.join(process.cwd(), 'dummy_user_data.json');
return JSON.parse(await fs.readFile(dummyUserDataFile, 'utf8'));
```

This file isn't committed to source control and is included in the Git ignore source file (.gitignore). Please request this file from a team member and place it in your local back-office\apps\web\ folder.  Without this file you will see an error when attempting to view cases on the front end.

### Running Locally the Applications Stack

Ensure a database is running and set up, then:

1. `apps/api` requires an `.env` file, copying `.env.example` gives a good starting point (see also [Database Environment Setup](#environment-setup)).
2. `apps/web` requires a `.env` file, copying `.env.example` gives a good starting point. Contact the Tech Lead or Senior Developer for support with this process or to request any environment variable values.

To run the apps, the recommended option is to have 2 terminals, one running the api, and one running the web app:

For applications:
```shell
# terminal 1
npm run api
# terminal 2
npm run web
```

You can also run the dev script in all apps via [Turbo](https://turbo.build/repo/docs), from root (although this sometimes fails due to an [npm bug](https://github.com/npm/cli/issues/5066)):

```shell
npm run dev
```

## Structure

```
.
+-- apps
|   +-- api-testing
|   +-- api
|   +-- e2e
|   +-- functions
|   +-- web
+-- docs
+-- packages
|   +-- add-auth-headers-for-backend
|   +-- applications
|   +-- blob-storage-client
|   +-- event-client
|   +-- express
|   +-- feature-flags
|   +-- key-vault-secrets-client
|   +-- platform
|   +-- redis
|   +-- scripts
```

|-|-|
|------------|-----------------------------------------------------------------|
| `apps`     | Contains deployable services                                    |
| `packages` | Contains shared code and configurations for use across the apps |


## Architecture

The architecture of the applications service and it's relationships with other systems can be viewed through interactive [C4 Model diagrams](https://c4model.com) held as [Structizier](https://docs.structurizr.com) code in the `workspace.dsl` file

This can be viewed locally through an interactive web interface by running `npm run c4`

Finally open your web browser to view [http://localhost:8080](http://localhost:8080)

There is also a deployed version of the C4 model available [here](https://planning-inspectorate.github.io/back-office/master/)

## Building

```shell
# In the root folder
npm run build
```

This will run the build process via Turbo, getting the benefit of speed and caching. All static assets will combiled in production mode and all requried distribution folders will be created.

## Tests

[Cypress](https://www.cypress.io/) is used for e2e tests, and [Jest](https://jestjs.io/) for unit testing.

Run the e2e tests with:

```shell
npm run e2e
```

Run the unit tests with:

```shell
npm run test
```

## API Documentation
> [!IMPORTANT]
> The following guide is specific to the development of the Applications Back Office. If setting-up the Appeals Back Office, please refer to the separate appeals repository.

The API is documented using an [OpenAPI (previously Swagger) spec](https://swagger.io/specification/v2/). The spec is generated from code comments in the Express route definitions.

To generate up-to-date documentation, run:

```shell
apps/api> npm run gen-api-spec
```

This will re-generate the `apps/api/src/server/swagger-output.json` file. This spec is hosted by the api, and can be found at `http://localhost:3000/api-docs/`.

## Style guide

Eslint is used to enforce styles. Run

```shell
npm run lint:js
```

to check all apps.

## Other Tools

If testing storage or the service bus integration, then some extra tools are useful, as below.

### Setting up Azure Blob Store emulator locally

[Please refer to the emulator setup document](./docs/azurite-blob-emulator.md)

## Docker

The apps are designed to run as containers, they can be built and run locally as per the instructions below.

#### API

To run the API with Docker, from the root directory run:

```shell
docker build . -t pins-back-office-api -f apps/api/Dockerfile
docker container run -dp 3000:3000 -t pins-back-office-api
```

which should create and run a container at `http://0.0.0.0:3000` on your machine.

#### Web

To build and run the WEB with Docker in `PRODUCTION RELEASE` mode, from the root directory run:

```shell
docker build . -t pins-web -f apps/web/Dockerfile
docker container run -dp 8080:8080 -t pins-web
```

The image is built as a docker multi-stage build process, where first we compile the static assets and then we run the app.

#### Document Storage

To run the Document Storage API with Docker, from the root directory run:

```shell
docker build . -t pins-back-office-document-storage -f apps/document-storage/Dockerfile
docker container run -dp 3001:3001 -t pins-back-office-document-storage
```

which should create and run a container at `http://0.0.0.0:3001` on your machine.

## Feature Flags

To start working with Feature Flags add the env variables below to the the `.env` files in `apps/api`, `apps/web` and `apps/e2e` and replace `<connection string>` in `PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING`

```shell
PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING="<connection string>"
STATIC_FEATURE_FLAGS_ENABLED="true"
```

`STATIC_FEATURE_FLAGS_ENABLED` is set to `true` by default. This tells the apps to use the local flags here `apps/packages/feature-flags/src/static-feature-flags.js`, if set to `false` the flags will be retrieved from `Azure Configuration` for the `DEV` environment.

> [!IMPORTANT]
> Feature Flags are created via `Terraform` and deployed to the relevant environments as needed. The engineer that sets new flags should also update the `static-feature-flags.js` so that the local environment is in sync with `Azure Configuration` for the `DEV` environment.

To use Feature Flags once the setup is complete you can import the `Feature Flag Client` in your code and use it to check a flag status by passing it's `Name`

```shell
import { featureFlagClient } from '<path>/<to>/common/feature-flags.js';

if (featureFlagClient.isFeatureActive('<feature-flag-name>')) {
	// code executes if flag is ON
} else {
	// code executes if flag is OFF or it doesn't exist
}
```

## Dependencies
The repo is currently utilising the [NPM Workspaces feature](https://docs.npmjs.com/cli/v8/using-npm/workspaces). This allows us to have a single root node_modules that holds all the project dependencies and a root package.json + package-lock.json that has every dependency + version that's used in the repository listed in it. 
Every app/function/package (known as workspaces) in the repo also has a package.json file where their dependency list has only the dependencies that the app/function/package in question requires and their versions are denoted as `*` which implies that they're relying on the root package.json for their versioning - this helps us keep versioning consistent across the repo. 

**First time installing dependencies**:
- run `npm ci` from the root of the project (this will use the project's package-lock.json file to sort your local node_modules directory and will avoid creating package-lock.json diffs where they're not expected).

**To add a dependency**:
- Add the name and desired version of the dependency to the root package.json (preferably prefixed with a `^` to ensure the most recent minor version is used)
- Add the name of the dependency with the version marked as a `*` to the app/function/package's package.json file that you want your dependency to be imported to
- Run `npm install`

*Note that on build, your dependency will not be available to any app/function/package in the repo that does not have the dependency listed in their respective package.json file (the code build process ensures that only the necessary dependencies are included in the build - see the Dockerfile inside apps/api and apps/web where `npm ci --workspaces --if-present` is ran)*

## Licensing

[MIT](https://opensource.org/licenses/mit) © Planning Inspectorate
