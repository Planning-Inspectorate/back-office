import { pick } from 'lodash-es';
import formatAddress from '../format-address.js';

/**
 *
 * @param {import('@pins/appeals.api').Schema.ServiceCustomer} serviceCustomer
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
	const applicantAddress = formatAddress(serviceCustomer.address);

	return {
		...applicantInfo,
		address: applicantAddress
	};
};
