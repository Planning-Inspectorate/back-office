/** @typedef {import("@pins/express").ValidationErrors | undefined} Error*/
export const errorAddressLine1 = (/** @type {Error}*/ errors) => {
	return errors?.addressLine1
		? {
				text: 'Enter address line 1, typically the building and street'
		  }
		: undefined;
};

export const errorTown = (/** @type {Error}*/ errors) => {
	return errors?.town
		? {
				text: 'Enter town or city'
		  }
		: undefined;
};

export const errorPostcode = (/** @type {Error}*/ errors) => {
	return errors?.postCode
		? {
				text: 'Enter a valid postcode'
		  }
		: undefined;
};
