import './src/index';
import './src/msal-plugin';

declare module '@pins/redis' {
	export * from './src/index';
}

export * from './src/types';
