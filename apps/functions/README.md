# Azure Functions

This folder contains the code for the Back Office [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview?pivots=programming-language-javascript) (referred to herein as Functions).

Functions are used to augment the functionality of the api and web apps, by providing (for example) a mechanism to respond to message queues, or trigger some background functionality. 

## Dev Setup

To be able to create new Functions, and run functions locally install azure-functions-core-tools:

`npm install -g azure-functions-core-tools@4`

Specific instructions for local dev are provided by each Function. In general, to start a function locally, use `func start`. 

## Terminology

The terminology around Functions can be confusing. Some key terms are:

* Azure Functions - the overall solution in Azure for "serverless" code execution
* Trigger - the cause/method by which a Function is started (e.g. HTTP call, or responding to an event)
* Azure Function - a specific Function (code) that can be executed to do a job
* Function Project - a container for one or more Functions. Functions in a project share configuration, but can each respond to a specific trigger.

## New Function

To create a new JavaScript Function, see the Azure documentation: 

[Quickstart: Create a JavaScript function in Azure from the command line](https://learn.microsoft.com/en-gb/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser&pivots=nodejs-model-v4)

The key parts are:

1. Ensure you have `azure-functions-core-tools` installed (try running `func --version` if you're not sure)
2. Create a function project with `func init <project-name>`
3. Navigate into the folder now created `cd <project-name>`
4. Create a function from a template with `func new --template <template-name> --name <func-name>` (for a list of templates, use `func templates list`. Common ones we might use include `HTTP trigger` and `Azure Service Bus Topic trigger`)
5. The `index.js` in the function folder should have the implementation added to it.
    a. The generated `index.js` will use `module.exports`, edit the function project `package.json` to add `"type": "module"`
    b. then edit the `index.js` to use  `export default async function` instead of `module.exports = async function`

**Note:** Most of the functions for back-office will be in their own function projects. This allows them to deployed individually, and permissions to be restricted to what is required by that function. When creating a new function, create a new function project for it too.

## Structure

This folder will contain function projects, and they will contain functions. Often there will be one function per function project, and they may have the same name. The structure will look like this (from root):

```
apps/
├─ functions/
│  ├─ function-project/
│  │  ├─ function/
│  ├─ document-check/
│  │  ├─ document-check/
```