import { HandlerFunction } from 'got';

declare module '@pins/platform' {
	export function createTtlHandler(): HandlerFunction;
	export function validatePostcode(value: string): boolean;
	export function validatePastDate(value: Date | string | number): boolean;
	export function validateFutureDate(value: Date | string | number): boolean;
	export function yesterday(): Date;
}

export interface LocalPlanningDepartment {
	FID: number;
	LPA21CD: string;
	LPA21NM: string;
	Co_terminous: 'Y' | 'N';
}
