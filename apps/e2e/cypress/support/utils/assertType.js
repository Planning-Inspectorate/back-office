// @ts-nocheck
function assertType(exactMatch) {
	return exactMatch ? 'have.text' : 'include.text';
}
module.exports = { assertType };
