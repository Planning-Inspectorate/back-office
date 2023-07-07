// @ts-nocheck
import { expect } from 'chai';
import { validateSchema } from '../../utils/schema-validation.js';
import {
	applicationInfo,
	blankQueryError,
	getPayload,
	invalidRoleError,
	request,
	schema,
	endpoint
} from './index.js';

describe(`POST - ${endpoint}`, () => {
	beforeEach(() => {
		request.clear();
	});

	describe('Positive', () => {
		it('should allow inspectors to perform a search', async () => {
			const { body: results, statusCode } = await request.post({
				payload: getPayload({ role: 'inspector' })
			});

			expect(statusCode).to.equal(200);
			await validateSchema(schema, results);
		});

		it('should allow case team members to perform a search', async () => {
			const { body: results, statusCode } = await request.post({
				payload: getPayload({ role: 'case-team' })
			});

			expect(statusCode).to.equal(200);
			await validateSchema(schema, results);
		});

		it('should allow case team admins to perform a search', async () => {
			const { body: results, statusCode } = await request.post({
				payload: getPayload({ role: 'case-admin-officer' })
			});

			expect(statusCode).to.equal(200);
			await validateSchema(schema, results);
		});

		it('Should return exact case match when searching by case title ', async () => {
			const { body: result, statusCode } = await request.post({
				payload: getPayload({ role: 'case-team', query: applicationInfo.title })
			});

			expect(statusCode).to.equal(200);
			await validateSchema(schema, result);
			expect(result.items[0].title).to.equal(applicationInfo.title);
			expect(result.items).to.have.lengthOf(1);
		});

		it('Should return exact case match when searching by case reference ', async () => {
			const { body: result, statusCode } = await request.post({
				payload: getPayload({ role: 'case-team', query: applicationInfo.reference })
			});

			expect(statusCode).to.equal(200);
			await validateSchema(schema, result);
			expect(result.items[0].reference).to.equal(applicationInfo.reference);
			expect(result.items).to.have.lengthOf(1);
		});

		it('Should return exact case match when searching by case description ', async () => {
			const { body: result, statusCode } = await request.post({
				payload: getPayload({ role: 'case-team', query: applicationInfo.description })
			});

			expect(statusCode).to.equal(200);
			await validateSchema(schema, result);
			expect(result.items[0].description).to.equal(applicationInfo.description);
			expect(result.items).to.have.lengthOf(1);
		});
	});

	describe('Negative', () => {
		it('should not return draft cases for inpectors', async () => {
			// Todo: ensure there is at least one draft case in the database
			const { body, statusCode } = await request.post({
				payload: getPayload({ role: 'inspector' })
			});

			expect(statusCode).to.equal(200);
			body.items.map((result) => {
				expect(result.status.toLowerCase()).not.to.equal('draft');
			});
		});

		it('should return a 403 error and relevant error message if the query parameter is missing or null', async () => {
			const { body, statusCode } = await request.post({
				payload: { query: null }
			});

			expect(statusCode).to.equal(403);
			expect(body).to.deep.equal(invalidRoleError);
		});

		it('should return a 403 error and relevant error message if the query parameter is missing or null', async () => {
			const { body, statusCode } = await request.post({
				payload: { query: null }
			});

			expect(statusCode).to.equal(403);
			expect(body).to.deep.equal(invalidRoleError);
		});

		it('should return a 403 error and relevant error message if the role parameter is invalid', async () => {
			const { body, statusCode } = await request.post({
				payload: { query: 'BC', role: 'invalid' }
			});

			expect(statusCode).to.equal(403);
			expect(body).to.deep.equal(invalidRoleError);
		});

		it('should return a 400 error and relevant error message if the query parameter is an empty string', async () => {
			const { body, statusCode } = await request.post({
				payload: { query: '', role: 'case-team' }
			});

			expect(statusCode).to.equal(400);
			expect(body).to.deep.equal(blankQueryError);
		});
	});
});
