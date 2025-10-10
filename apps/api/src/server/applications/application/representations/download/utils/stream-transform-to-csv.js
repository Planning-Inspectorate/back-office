import stream from 'stream';
import { mapPublishedRepToCsv, mapValidRepToCsv } from './map-rep-to-csv.js';

const Transform = stream.Transform;

export class TransformToCSV extends Transform {
	constructor(options) {
		super(options);
		this.type = options.type;
	}

	_transform(chunk, enc, cb) {
		const mapper = this.type === 'published' ? mapPublishedRepToCsv : mapValidRepToCsv;
		this.push(mapper(chunk));
		cb();
	}
}
