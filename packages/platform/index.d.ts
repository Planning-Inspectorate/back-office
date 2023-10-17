import './http/hooks';
import './testing/assets/assets';
import './testing/fake';
import './testing/html-parser';
import './utils/date';
import './utils/dotenv';
import './utils/filter';
import './utils/redis';
import './utils/url';
import './validators/date';
import './validators/postcode';

declare module '@pins/platform' {
	export * from './http/hooks';
	export * from './testing/assets/assets';
	export * from './testing/fake';
	export * from './testing/html-parser';
	export * from './utils/date';
	export * from './utils/dotenv';
	export * from './utils/filter';
	export * from './utils/redis';
	export * from './utils/url';
	export * from './validators/date';
	export * from './validators/postcode';
}

export * from './types/account';
