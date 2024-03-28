import { Readable } from 'stream';
/**
 * @param {String} string
 * @returns {Readable}
 */
export const stringToStream = (string) => {
	const stream = new Readable();
	stream.push(string);
	stream.push(null);
	return stream;
};
