# Planning Inspectorate Back Office

> This is the Planning Inspectorate Back Office monorepo that holds the API and WEB apps plus any additional required packages.

- [Planning Inspectorate Back Office](#planning-inspectorate-back-office)
	- [Installing / Getting started](#installing--getting-started)
	- [Developing](#developing)
		- [Built With](#built-with)
		- [Prerequisites](#prerequisites)
		- [Setting up Dev](#setting-up-dev)
		- [Setting up Database locally](#setting-up-database-locally)
		- [Building](#building)
		- [Deploying / Publishing](#deploying--publishing)
		- [Docker](#docker)
			- [API](#api)
			- [Web](#web)
	- [Configuration](#configuration)
	- [Tests](#tests)
	- [Style guide](#style-guide)
	- [Licensing](#licensing)

## Installing / Getting started

In order to get started you will need to run the LTS version of [Node.js](https://nodejs.org/en/).

Additionaly you can run the entire solution using Docker containers so a local [Docker](https://www.docker.com/products/docker-desktop) instance is required.

The repository is structured like a monorepo with two main folders `apps` and `packages`.

`apps` - Holds the main Express.js applications responsible for the DB access API backend and the front facing web app.
`packages` - Holds the common packages that can be used by all apps.

## Developing

### Built With

The entire solution is built on top [Express.js](https://expressjs.com/) and [Nunjucks templating language](https://mozilla.github.io/nunjucks/templating.html), both for the web and api backends.

### Prerequisites

Before you get started you need to make sure you are running the latest Node LTS version and latest NPM version.

### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
# Navigate to a folder on your system and clone the repository.
git clone git@github.com:Planning-Inspectorate/back-office.git
cd back-office
```

Once the repository has been cloned you can follow the instructions bellow to run it locally.

```shell
# Run NPM install to install all workspace dependencies.
# This will install all packages and apps dependencies so you don't have to run it in all folders.
npm ci
```

Duplicate `apps/web/.env.development` and rename it to `.env.local`
Add `SESSION_SECRET=anyValue` to the end of `.env.local`

Run all apps in dev mode

```shell
# This will run the dev script in all apps via Turbo
npm run dev

# OR you can manually run them
npm run dev --workspace=@pins/api
npm run dev --workspace=@pins/web
npm run dev --workspace=@pins/document-storage

# OR you can cd into the folder and run
cd apps/web
npm run dev
```

You can then open the local development server at `http://localhost:8080`.

### Setting up Database locally

> ⚠️ The local DB instance will be needed to run the API app.

Use Docker to run an instance of a SQL Server Docker container using the command:

```shell
sudo docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=<YourStrong@Passw0rd>" \
   -p 1433:1433 --name pins_sql_server --hostname pins_sql_server \
   -d mcr.microsoft.com/mssql/server:2019-latest

# For M1 Macs until [this issue](https://github.com/microsoft/mssql-docker/issues/668) gets resolved should use this version
# or as an alternative you can use [colima](https://github.com/abiosoft/colima) instead of Docker.

# Additionally, SQL Client tools are not included in the sql-edge image for ARM64, so you won't be able to use sqlcmd from with the container. One workaround for this is to use the mcr.microsoft.com/mssql-tools docker image. You can run this temporarily in another container and connect to your pins_sql_server container by name if they are on the same network. Firstly, create a network:
docker network create -d bridge db_network

# Then, start your pins_sql_server container in that same network
docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>' -p 1433:1433 --name pins_sql_server --network db_network -d mcr.microsoft.com/azure-sql-edge

# Later on, when connecting to the database, follow the instructions for ARM64
```

and create a `.env` file containing the following string:

```json
DATABASE_URL="sqlserver://0.0.0.0:1433;database=pins_development;user=sa;password=<YourStrong@Passw0rd>;trustServerCertificate=true"
```

You will need to also create a database called `pins_development` within your Docker container:

```shell
# 1.1 If you're NOT on ARM64
# Firstly you'll need to access sqlcmd. Connect to the pins_sql_server interactive shell where sqlcmd will be installed
sudo docker exec -it pins_sql_server "bash"

# then within the container:
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<YourStrong@Passw0rd>"

# 1.2 If you ARE on ARM64
# Instead of connecting to the pins_sql_server interactive shell, run the mssql-tools image as a container and connect to the pins_sql_server host like so (this requires that your pins_sql_server container is running on the network you created):
docker run --network db_network -it mcr.microsoft.com/mssql-tools

# Within the interactive shell, you'll then be able to run sqlcmd like so:
sqlcmd -S pins_sql_server -U SA -P "<YourStrong@Passw0rd>"

# 2. Then within the SQL command prompt:
CREATE DATABASE pins_development
GO

# then you can exit with
exit
```

Next step will be to run the Prisma migrations and seed to get some test data. Pleas follow the [docs here](docs/database-migration.md).

### Setting up RabbitMQ locally

We use RabbitMQ to emulate working with Azure Service Bus. We use a plugin to send messages to the instance using the AMQP 1.0 protocol. Run the following command:

```shell
docker-compose up
```

then visit `http://localhost:15672/` to manage RabbitMQ using the username `guest` and password `guest`.

### Setting up Azure Blob Store emulator locally

Run the following command:

```shell
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 --name blob-store-test -d mcr.microsoft.com/azure-storage/azurite:latest
```

### Building

Building the entire solution means running most of the dev tools into PROD mode.

```shell
# In the root folder
npm run build
```

This will run the build process via Turbo, getting the benefit of speed and caching. All static assets will combiled in production mode and all requried distribution folders will be created.

### Deploying / Publishing

TODO: Once we have the pipelines ready update the docs here.

give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

### Docker

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

## Configuration

All required configurations are part of dotenv files found in each application's
root folder. If you want to change any of the variables used for the environment
under which you're running, create an `.env.local` file in the root of the
application to extend the configuration.
The Web application requires an `.env.local` with configuration for the local dev environment.

## Tests

Describe and show how to run the tests with code examples.
Explain what these tests test and why.

```shell
Give an example
```

Coverage for Backend testing reporting available with the instruction:
```
npm run coverage
``

## Swagger documentation

In order to be able to generate the ducumentation fom Swagger you need to travel to the api folder in your terminal and run:
```
npm run swagger-autogen
```
that will create/re-do the `swagger-output.json` that is the source of information for the documentation file.
That documentation can be checked in `/api-docs/` in the localhost

## Style guide

The codebase has README.md files in all relevant folder that explain what is the purpose or any other guidelines to follow.

## Licensing

[MIT](https://opensource.org/licenses/mit) © Planning Inspectorate
