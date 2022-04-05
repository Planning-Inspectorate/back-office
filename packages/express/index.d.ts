import { NextFunction, ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ValidationError } from 'express-validator';

// relocate this app folder once it can be included
declare global {
	namespace Express {
		interface Request {
			validationErrors: Record<string, ValidationError>;
		}
	}
}

export interface CommandHandler<
	P = ParamsDictionary,
	RenderOptions extends Record<string, unknown> = {},
	ReqBody = unknown,
	Locals extends Record<string, any> = Record<string, any>
> {
	(req: Request<P, string, ReqBody, unknown, Locals>, res: RenderedResponse<RenderOptions, Locals>, next: NextFunction): void;
}

export interface FileHandler<
	P = ParamsDictionary,
	RenderOptions extends Record<string, unknown> = {},
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
> extends Response<string, Locals, StatusCode> {
	render(view: string, options?: RenderOptions, callback?: (err: Error, html: string) => void): void;
}

export interface ErrorRenderOptions {
	errors: Record<string, ValidationError>;
}
