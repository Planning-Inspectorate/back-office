import { NextFunction, ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ValidationError } from 'express-validator';
import { ParsedQs } from 'qs';

type LocalsWithValidationErrors = { errors?: Record<string, ValidationError> };

export interface CommandHandler<
	P = ParamsDictionary,
	RenderOptions extends Record<string, unknown> = {},
	ReqBody = unknown,
	Locals extends Record<string, any> = Record<string, any>
> {
	(
		req: Request<P, string, ReqBody, unknown, Locals>,
		res: RenderedResponse<RenderOptions, Locals>,
		next: NextFunction
	): void;
}

export interface QueryHandler<
	P = ParamsDictionary,
	RenderOptions extends Record<string, unknown> = {},
	ReqQuery extends ParsedQs = ParsedQs,
	Locals extends Record<string, any> = Record<string, any>
> {
	(
		req: Request<P, string, unknown, ReqQuery, Locals>,
		res: RenderedResponse<RenderOptions, Locals>,
		next: NextFunction
	): void;
}

export interface RenderedResponse<
	RenderOptions extends Record<string, unknown> = {},
	Locals extends Record<string, any> = unknown,
	StatusCode extends number = number
> extends Response<string, Locals & LocalsWithValidationErrors, StatusCode> {
	render(
		view: string,
		options?: RenderOptions,
		callback?: (err: Error, html: string) => void
	): void;
}

export interface ErrorRenderOptions {
	errors: Record<string, ValidationError>;
}
