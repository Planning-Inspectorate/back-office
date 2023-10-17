import { pick } from 'lodash-es';
import formatAddressLowerCase from '../address-formatter-lowercase.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.ServiceUser} serviceUser
 * @returns {object}
 */
export const mapServiceUser = (serviceUser) => {
	const applicantInfo = pick(serviceUser, [
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
	const applicantAddress = formatAddressLowerCase(serviceUser.address);

	return {
		...applicantInfo,
		address: applicantAddress
	};
};
