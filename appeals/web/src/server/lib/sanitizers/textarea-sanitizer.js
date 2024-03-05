import { body } from 'express-validator';

export const createTextAreaSanitizer = (fieldName = 'textarea') => {
	return body(fieldName).customSanitizer((value) => {
		const sanitizedValue = value.replace(/\r\n/g, '\n');
		return sanitizedValue;
	});
};
