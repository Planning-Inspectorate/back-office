# Planning Inspectorate Back Office

> This is the Planning Inspectorate Back Office monorepo that holds the API and WEB apps plus any additional required packages.

- [Planning Inspectorate Back Office](#planning-inspectorate-back-office)
	- [Features](#features)
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
	- [Swagger documentation](#swagger-documentation)
	- [Style guide](#style-guide)
	- [Licensing](#licensing)

## Features

- CSS with superpowers via [Scss](https://sass-lang.com/)
- CSS [Autoprefixing](https://github.com/postcss/autoprefixer), [PostCSS](http://postcss.org/)
- Built in CSS architecture bet practices with utility classes and sensitive settings
- Bundled JS code using [rollup.js](https://rollupjs.org/)
- Enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
- Map compiled CSS/JS to source stylesheets/js with source maps
- [browserslist](http://browserl.ist/) support for babel and friends
- Linting done with [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/) using internal configs
- Monorepo management using [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) and [Turborepo](https://turborepo.org/) (is a high-performance build system)
- Custom task runner using promises

## Installing / Getting started

In order to get started you will need to run the LTS version of [Node.js](https://nodejs.org/en/).

Additionaly you can run the entire solution using Docker containers so a local [Docker](https://www.docker.com/products/docker-desktop) instance is required.

The repository is structured like a monorepo with two main folders `apps` and `packages`.

```
.
├── apps
│  ├── api
│  └── web
├── packages
│  └── eslint-config
│  └── planning-inspectorate-libs
```

`apps` - Holds the main Express.js applications responsible for the DB access API backend and the front facing web app.
`packages` - Holds the common packages that can be used by all apps.

## Developing

### Built With

The entire solution is built on top [Express.js](https://expressjs.com/) and [Nunjucks templating language](https://mozilla.github.io/nunjucks/templating.html), both for the web and api backends.

### Prerequisites

Before you get started you need to make sure you are running the latest Node LTS version and latest NPM version.

If you want to change the local env variables defaults create a `.env.local` local environment file within both the web and api apps folders and override the predefined ones.

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

Run all apps in dev mode

```shell
# This will run the dev script in all apps via Turbo
npm run dev

# OR you can manually run them
npm run dev --workspace=api
npm run dev --workspace=web

# OR you can cd into the folder and run
cd apps/web
npm run dev
```

This will run all apps in dev mode. For example the Web app will run the Sass compiler, Rollup for JS bundling and various other tools (most of them in watch mode).

Then you can open the local dev server `http://localhost:8080`.

### Setting up Database locally

> ⚠️ The local DB instance will be needed to run the API app.

Use Docker to run an instance of a SQL Server Docker container using the command:

```shell
sudo docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=<YourStrong@Passw0rd>" \
   -p 1433:1433 --name pins_sql_server --hostname pins_sql_server \
   -d mcr.microsoft.com/mssql/server:2019-latest
```

and create a `.env` file containing the following string:

```json
DATABASE_URL="sqlserver://0.0.0.0:1433;database=pins_development;user=sa;password=<YourStrong@Passw0rd>;trustServerCertificate=true"
```

You will need to also create a database called `pins_development` within your Docker container:

```shell
sudo docker exec -it pins_sql_server "bash"

# then within the container:
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<YourStrong@Passw0rd>"

# then within the SQL command prompt:

CREATE DATABASE pins_development
GO

# then you can exit with
exit
```

Next step will be to run the Prisma migrations and seed to get some test data. Pleas follow the [docs here](docs/database-migration.md).

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
docker container run -dp 8080:8080 -t pins-back-office-web
```

The image is built as a docker multi-stage build process, where first we compile the static assets and then we run the app.

## Configuration

All required configurations are part of `.env` files or app specific config file that are used throughout the entire applications.

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
