import { mapValues } from 'lodash-es';

const mapObjectKeysToStrings = (object) => {
	return mapValues(object, (_value, key) => {
		return key;
	});
};

export default mapObjectKeysToStrings;
