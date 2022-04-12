import { NextFunction, ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ValidationChain, ValidationError } from 'express-validator';
import { RequestHandler } from 'express';

declare module '@pins/express' {
	export interface CreateWhitelistedKeysValidatorOptions {
		errorMessage: string;
		whitelist: string[];
	}

	export const createWhitelistedKeysValidator: (options: CreateWhitelistedKeysValidatorOptions) => (value: unknown) => boolean;
	export const composeMiddleware: (...middlewareFns: RequestHandler[]) => RequestHandler;
	export const createValidator: (...validationFns: (ValidationChain[] | RequestHandler)[]) => RequestHandler;
	export const expressValidatorErrorHandler: RequestHandler;
	export const mapMulterErrorToValidationError: RequestHandler<any>;
}

type LocalsWithValidationErrors = { errors?: Record<string, ValidationError> };

export interface CommandHandler<
	P = ParamsDictionary,
	RenderOptions extends Record<string, unknown> = {},
	ReqBody = unknown,
	Locals extends Record<string, any> = Record<string, any>
> {
	(req: Request<P, string, ReqBody, unknown, Locals>, res: RenderedResponse<RenderOptions, Locals>, next: NextFunction): void;
}

export interface QueryHandler<
	P = ParamsDictionary,
	RenderOptions extends Record<string, unknown> = {},
	ReqQuery extends ParsedQs = ParsedQs,
	Locals extends Record<string, any> = Record<string, any>
> {
	(req: Request<P, string, unknown, ReqQuery, Locals>, res: RenderedResponse<RenderOptions, Locals>, next: NextFunction): void;
}

export interface RenderedResponse<
	RenderOptions extends Record<string, unknown> = {},
	Locals extends Record<string, any> = unknown,
	StatusCode extends number = number
> extends Response<string, Locals & LocalsWithValidationErrors, StatusCode> {
	render(view: string, options?: RenderOptions, callback?: (err: Error, html: string) => void): void;
}

export interface ErrorRenderOptions {
	errors: Record<string, ValidationError>;
}
