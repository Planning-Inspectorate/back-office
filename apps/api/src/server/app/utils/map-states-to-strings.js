import { mapValues } from 'lodash-es';

const mapObjectKeysToStrings = function(object) {
	return mapValues(object, function(_value, key) { 
		return key;
	});
};

export default mapObjectKeysToStrings;
