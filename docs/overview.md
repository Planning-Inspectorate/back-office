# Overview

## Controllers

Controllers are responsible for handling incoming **requests** and returning **responses** to the client.

A controller's purpose is to receive specific requests for the application. The routing mechanism controls which controller receives which requests.

Exampe Auth controller `user.controller.js` that renders a view after a GET request.

```js
/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
	response.render('user/homepage');
}

module.exports = { get };
```

## Providers

Providers are a fundamental concept. Many of the basic classes may be treated as a provider – services, factories, helpers, and so on.

The main idea behind a provider is that it can be **injected** as dependency; this means objects can create various relationships with each other.

Example of a service that calls API data and is used by a controller.

```js
// validation.service.js

function findAllAppeals() {
	// Do fetch request to API and return data.
	return this.appeals;
}
```

```js
// validation.controller.js
const validationService = require('./validation.service);

function get(req, res) {
	const data = validationService.findAllAppeals();
	response.render('validation/homepage', data);
}

module.exports = { get };
```

## Middleware

Middleware is a function which is called **before** the route handler. Middleware functions have access to the **request** and **response** objects, and the `next()` middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named `next`.
