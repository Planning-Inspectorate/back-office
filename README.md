# Planning Inspectorate Back Office

> This is the Planning Inspectorate Back Office monorepo that holds the API and WEB apps plus any additional required packages.

## Features

- Enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
- Bundled JS code using [rollup.js](https://rollupjs.org/)
- CSS with superpowers via [Scss](https://sass-lang.com/)
- CSS [Autoprefixing](https://github.com/postcss/autoprefixer), [PostCSS](http://postcss.org/)
- Built in CSS architecture bet practices with utility classes and sensitive settings
- Map compiled CSS/JS to source stylesheets/js with source maps
- Built in Node JS server (including http2 / https support) using [Express.js](https://expressjs.com/)
- [browserslist](http://browserl.ist/) support for babel and friends
- Linting done with [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/)
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
│  └── ui
```

`apps` - Holds the main Express.js applications responsible for the DB access API backend and the front facing web app.
`packages` - Holds the common packages that can be used by all apps.

## Developing

### Built With

The entire solution is built with [Express.js](https://expressjs.com/) and [Nunjucks templating language](https://mozilla.github.io/nunjucks/templating.html), both for the web and api backends.

### Prerequisites

Before you get started you need to create a `.env` local environment file within both the web and api apps folders.

TODO: Finish this chapter.

### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
# Navigate to a folder on your system and clone the repository
git clone git@github.com:Planning-Inspectorate/back-office.git
cd back-office
```

Once the repository has been cloned you can follow the instructions bellow to run it locally.

And state what happens step-by-step. If there is any virtual environment, local server or database feeder needed, explain here.

### Building

If your project needs some additional steps for the developer to build the
project after some code changes, state them here. for example:

```shell
./configure
make
make install
```

Here again you should state what actually happens when the code above gets
executed.

### Deploying / Publishing

give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

## Tests

Describe and show how to run the tests with code examples.
Explain what these tests test and why.

```shell
Give an example
```

## Style guide

Explain your code style and show how to check it.

## Licensing

[MIT](https://opensource.org/licenses/mit) © Planning Inspectorate