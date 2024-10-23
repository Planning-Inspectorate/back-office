import { niDbQueryMock, odwQueryMock } from './mock-db-queries.js';

// eslint-disable-next-line no-undef
beforeEach(() => {
	niDbQueryMock.mockReset();
	odwQueryMock.mockReset();
});
