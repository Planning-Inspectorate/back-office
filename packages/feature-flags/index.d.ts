import './src/is-feature-active';
import './src/feature-flag-client';

declare module '@pins/feature-flags' {
	export * from './src/is-feature-active';
	export * from './src/feature-flag-client';
}
