const stringEmptyOrUndefined = (string_) => {
	return (string_ === '' || typeof(string_) === 'undefined');
};

export default stringEmptyOrUndefined;
