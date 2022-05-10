declare type DeepPartial<T> = T extends Function
	? T
	: T extends object
	? T extends unknown[]
		? DeepPartial<T[number]>[]
		: { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

declare type Only<T, K extends keyof T> = Partial<T> & Required<{ [key in K]: T[K] }>;
