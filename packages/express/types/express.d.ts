import {
	NextFunction,
	ParamsDictionary,
	Request as ExpressRequest,
	Response
} from 'express-serve-static-core';
import { ValidationError } from 'express-validator';
import { ParsedQs } from 'qs';

export type ValidationErrors = Record<string, ValidationError>;
export type ExtendedValidationErrors =
	| ValidationErrors
	| { [p: string] }
	| { guid: string; msg: string }[];

declare global {
	namespace Express {
		interface Request {
			locals: any;
			errors?: ValidationErrors;
		}
	}
}

interface Request<
	ReqLocals extends Record<string, any> = Record<string, any>,
	Params = ParamsDictionary,
	ResBody = unknown,
	ReqBody = unknown,
	ReqQuery = ParsedQs,
	ResLocals extends Record<string, any> = Record<string, any>
> extends ExpressRequest<Params, ResBody, ReqBody, ReqQuery, ResLocals> {
	locals: ReqLocals;
}

export interface RequestHandler<
	ReqLocals extends Record<string, any>,
	Params = ParamsDictionary,
	ResBody = unknown,
	ReqBody = unknown,
	ReqQuery = ParsedQs,
	ResLocals extends Record<string, any> = Record<string, any>
> {
	(
		req: Request<ReqLocals, Params, ResBody, ReqBody, ReqQuery, Locals>,
		res: RenderedResponse<RenderOptions, ResLocals>,
		next: NextFunction
	): void;
}

export interface AsyncRequestHandler<
	Params = ParamsDictionary,
	ResBody = unknown,
	ReqBody = unknown,
	ReqQuery = ParsedQs,
	ResLocals extends Record<string, any> = Record<string, any>
> {
	(
		req: ExpressRequest<Params, ResBody, ReqBody, ReqQuery, Locals>,
		res: Response<ResBody, ResLocals>,
		next: NextFunction
	): Promise<void>;
}

export interface RenderHandler<
	RenderOptions extends Record<string, any>,
	ReqLocals extends Record<string, any> = undefined,
	ReqBody = undefined,
	ReqQuery extends ParsedQs = ParsedQs,
	Params extends ParamsDictionary = ParamsDictionary,
	Locals extends Record<string, any> = Record<string, any>
> {
	(
		req: Request<ReqLocals, Params, string, ReqBody, ReqQuery, Locals>,
		res: RenderedResponse<RenderOptions, Locals>,
		next: NextFunction
	): void;
}

interface RenderedResponse<
	RenderOptions extends Record<string, any>,
	Locals extends Record<string, any>,
	StatusCode extends number = number
> extends Response<string, Locals, StatusCode> {
	render(
		view: string,
		options?: RenderOptions,
		callback?: (err: Error, html: string) => void
	): void;
}
