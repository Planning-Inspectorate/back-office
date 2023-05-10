function isCI() {
	return Cypress.env('isCI');
}

module.exports = { isCI };
