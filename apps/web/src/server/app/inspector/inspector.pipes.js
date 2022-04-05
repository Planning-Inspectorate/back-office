
/**
 * 
 * @type import('express').RequestHandler
 */
export const registerInspectorLocals = (_, response, next) => {
	response.locals.serviceName = 'Appeal a householder planning decision';
	response.locals.serviceUrl = '/inspector';
	next();
};
