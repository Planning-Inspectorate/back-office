import stream from 'stream';
import { mapRepToCsv } from './map-rep-to-csv.js';

const Transform = stream.Transform;

export class TransformToCSV extends Transform {
	constructor(options) {
		super(options);
	}

	_transform(chunk, enc, cb) {
		this.push(mapRepToCsv(chunk));
		cb();
	}
}
