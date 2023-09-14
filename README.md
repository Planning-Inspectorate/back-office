# Planning Inspectorate Back Office

This is the Planning Inspectorate Back Office monorepo that contains all the apps for running the back office. 

The back office system contains individual stacks for appeal and applications back office features. Each includes a JSON API, which retrieves data from a database, and a web front-end (utilising [server-side rendering](https://web.dev/rendering-on-the-web/#server-rendering)). There are also some [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) for background tasks (such as virus scans), [Azure Blob Storage](https://azure.microsoft.com/en-gb/products/storage/blobs) is used for documents, and [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) for integration.

Most of the apps are built with [Express.js](https://expressjs.com/), and the front-end uses the [Nunjucks templating language](https://mozilla.github.io/nunjucks/templating.html) and the [GOV.UK Design System](https://design-system.service.gov.uk/).

- [Getting Started](#getting-started)
- [Tests](#tests)
- [API Documentation](#api-documentation)
- [Style Guide](#style-guide)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) LTS & npm
* [Docker](https://www.docker.com/products/docker-desktop) (to run a local db)

### Database Setup

#### Database Server Setup

Use Docker to run an instance of SQL Server, replace "<YourStrong@Passw0rd>":

```shell
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=<YourStrong@Passw0rd>" -p 1433:1433 --name pins_sql_server --hostname pins_sql_server -d mcr.microsoft.com/mssql/server:2019-latest
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
> If setting up both Applications and Appeals back offices locally, it is recommended to create 2 separate databases, so they can be referenced independently from `apps/api` and `appeals/api` configurations.

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
> The following guide is specific to the development of the Applications Back Office. If setting-up the Appeals Back Office, please note that the following operations need to be executed in the `appeals/api` folder instead.

The `api` app needs to know how to connect to the database. Create a `.env` file in `apps/api` with a `DATABASE_URL` entry, as follows:

```
DATABASE_URL="sqlserver://0.0.0.0:1433;database=pins_development;user=sa;password=<YourStrong@Passw0rd>;trustServerCertificate=true"
```

##### Appeals API

Add the following env var to the `.env` file in `appeals/api`

```
TEST_MAILBOX=test@example.com
```

#### Schema & Seed Data
> [!IMPORTANT]
> The following guide is specific to the development of the Applications Back Office. If setting-up the Appeals Back Office, please note that the following operations need to be executed in the `appeals/api` folder instead.

1. First setup the database schema

```shell
apps/api> npm run db:migrate
```

2. Next add the seed data

```shell
apps/api> npm run db:seed
```
### Running Locally the Applications Stack

> [!IMPORTANT]
> If running the Appeal Back Office instead of the Applications Back Office, apply the below to the `appeals` folder instead.

Ensure a database is running and setup, then:

1. `apps/api` requires an `.env` file with a `DATABASE_URL` entry, as per [Database Environment Setup](#environment-setup)
2. `apps/web` requires a `.env.local` file, copying `.env.development` gives a good starting point, but `SESSION_SECRET=anyValue` needs adding to it

To run the apps, the recommended option is to have 2 terminals, one running the api, and one running the web app:

For applications:
```shell
# terminal 1
npm run api:applications
# terminal 2
npm run web:applications
```

For appeals:
```shell
# terminal 1
npm run api:appeals
# terminal 2
npm run web:appeals
```

You can also run the dev script in all apps via [Turbo](https://turbo.build/repo/docs), from root (although this sometimes fails due to an [npm bug](https://github.com/npm/cli/issues/5066)):

```shell
npm run dev:applications
# or
npm run dev:appeals
```

## Structure

The main folders are `apps` (which contains the deployable services, such as the API and web front-end for the Application stack), `appeals` (which contains the deployable services, such as the API and web front-end for the Appeal stack) and `packages` which contains libraries, as well as shared code and configuration. The whole setup is using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

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
> The following guide is specific to the development of the Applications Back Office. If setting-up the Appeals Back Office, please note that the following operations need to be executed in the `appeals/api` folder instead.

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

## Licensing

[MIT](https://opensource.org/licenses/mit) © Planning Inspectorate
