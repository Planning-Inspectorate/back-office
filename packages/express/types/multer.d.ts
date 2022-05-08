import { Readable } from 'stream';

// multer does not export this directly, and instead namespaces it under
// `Express` global after importing multer. This is fine for dealing within
// files directly from the request handler, but if we pass that file to a
// separate file (such as a service), then we need a distinct definition for
// typing purposes
export interface MulterFile {
	fieldname: string;
	originalname: string;
	mimetype: string;
	size: number;
	stream: Readable;
	destination: string;
	filename: string;
	path?: string;
	buffer: Buffer;
}
