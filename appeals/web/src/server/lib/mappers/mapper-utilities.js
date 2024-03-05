/**
 * Clone the object (shallow) and remove any 'actions' properties that are present
 * @param {Object|null|undefined} value
 * @returns {any|undefined}
 */
export function removeSummaryListActions(value) {
	if (value === undefined || value === null) {
		return;
	}

	const clonedObject = { ...value };

	Object.keys(clonedObject).forEach((key) => {
		if (key === 'actions') {
			Reflect.deleteProperty(clonedObject, key);
		}
	});

	return clonedObject;
}
