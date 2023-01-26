import { jest } from '@jest/globals';

export const mockWindowLocation = () => {
	const mockLocation = new URL('http://localhost');

	// the following TS-ignores are necessary
	// the real window.Location is being replaced with an URL instance
	// the URL type doesnt match the Location type
	// and TsCheck returns an error correctly

	// @ts-ignore
	mockLocation.assign = jest.fn();
	// @ts-ignore
	delete window.location;
	// @ts-ignore
	window.location = mockLocation;
};

export const spyClickOnAnchor = () => {
	jest.spyOn(HTMLAnchorElement.prototype, 'click');
};
