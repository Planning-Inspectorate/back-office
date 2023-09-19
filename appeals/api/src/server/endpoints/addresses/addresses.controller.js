import logger from '#utils/logger.js';
import { ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatAddress } from './addresses.formatter.js';
import addressRepository from '#repositories/address.repository.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
const getAddressById = (req, res) => {
	const { address } = req.appeal;
	const formattedAddress = (address && formatAddress(address)) || {};

	return res.send(formattedAddress);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateAddressById = async (req, res) => {
	const {
		body,
		body: { addressLine1, addressLine2, country, county, postcode, town },
		params: { addressId }
	} = req;

	try {
		await addressRepository.updateAddressById(Number(addressId), {
			addressLine1,
			addressLine2,
			addressCountry: country,
			addressCounty: county,
			postcode,
			addressTown: town
		});
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAddressById, updateAddressById };
