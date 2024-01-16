/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {{body: { inputDate: string }}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * */
export const validate = async (req, res) => {
	return res.send(true);
};
