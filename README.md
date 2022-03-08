# Planning Inspectorate Back Office

> This is the Planning Inspectorate Back Office monorepo that holds the API and WEB apps plus any additional required packages.

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

## Style guide

The codebase has README.md file in all relevant folder that explain what is the purpose or any other guidelines to follow.

## Licensing

[MIT](https://opensource.org/licenses/mit) © Planning Inspectorate
