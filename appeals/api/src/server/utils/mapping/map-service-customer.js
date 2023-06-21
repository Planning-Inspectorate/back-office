import { pick } from 'lodash-es';
import formatAddressLowerCase from '../address-formatter-lowercase.js';

/**
 *
 * @param {import('@pins/api').Schema.ServiceCustomer} serviceCustomer
 * @returns {object}
 */
export const mapServiceCustomer = (serviceCustomer) => {
	const applicantInfo = pick(serviceCustomer, [
		'id',
		'organisationName',
		'firstName',
		'middleName',
		'lastName',
		'email',
		'address',
		'website',
		'phoneNumber'
	]);
	const applicantAddress = formatAddressLowerCase(serviceCustomer.address);

	return {
		...applicantInfo,
		address: applicantAddress
	};
};
