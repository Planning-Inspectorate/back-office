// @ts-nocheck
import data from '../../schemas/applications-search-post.json' assert { type: 'json' };
import { TestService } from '../../services/test-service.js';

const schema = data.responses[200].schema;
const { path: endpoint } = data;
const request = new TestService(endpoint);

const applicationInfo = {
	title: 'Tourism Test Application 3',
	reference: 'BC0910003',
	description: 'A description of test case 3 which is a case of subsector type Tourism'
};

const getPayload = ({ role = 'case-team', query = 'BC', pageNumber = 1, pageSize = 50 } = {}) => {
	return { role, query, pageNumber, pageSize };
};

const invalidRoleError = { errors: { role: 'Role is not valid' } };
const blankQueryError = { errors: { query: 'Query cannot be blank' } };

export { schema, request, applicationInfo, getPayload, invalidRoleError, blankQueryError };
