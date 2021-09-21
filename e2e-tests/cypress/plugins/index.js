// cucumber configuration
const cucumber = require('cypress-cucumber-preprocessor').default;
//const htmlvalidate = require("cypress-html-validate/dist/plugin");
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    on('file:preprocessor', cucumber());
    on('task', {
        log(message) {
            console.log(message)
            return null
        },
    });
     }

const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
module.exports = (on, config) => {
    on('task', {downloadFile})
}