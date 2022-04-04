import _ from 'lodash';

const mapObjectKeysToStrings = function(object) {
	return _.mapValues(object, function(_value, key) { 
		return key;
	});
};

export default mapObjectKeysToStrings;
