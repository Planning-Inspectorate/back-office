import './config/dotenv';
import './http/ttl';
import './util/date';
import './util/filter';
import './validators/date';
import './validators/postcode';

declare module '@pins/platform' {
	export * from './config/dotenv';
	export * from './http/ttl';
	export * from './util/date';
	export * from './util/filter';
	export * from './validators/date';
	export * from './validators/postcode';
}
