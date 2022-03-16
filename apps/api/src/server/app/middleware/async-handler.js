const asyncHandler = (function_) => (request, res, next) => Promise
	.resolve(function_(request, res, next))
	.catch(next);

export default asyncHandler;
