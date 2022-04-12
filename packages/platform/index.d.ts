import { HandlerFunction } from 'got';

declare module '@pins/platform' {
	export function createTtlHandler(): HandlerFunction;
	export function validatePostcode(value: string): boolean;
	export function validatePastDate(value: Date | string | number): boolean;
	export function validateFutureDate(value: Date | string | number): boolean;
	export function yesterday(): Date;
}

export type RequireAtLeastOneKey<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];
