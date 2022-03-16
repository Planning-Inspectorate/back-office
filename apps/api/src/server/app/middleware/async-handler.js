const asyncHandler = (function_) => (request, response, next) => Promise
	.resolve(function_(request, response, next))
	// eslint-disable-next-line promise/no-callback-in-promise
	.catch(next);

export default asyncHandler;
