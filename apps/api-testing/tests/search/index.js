// @ts-nocheck
import data from '../../schemas/applications-search-post.json' assert { type: 'json' };
import { TestService } from '../../services/test-service.js';

const schema = data.responses[200].schema;
const { path: endpoint } = data;
const request = new TestService(endpoint);

const applicationInfo = {
	title: 'Office Use Test Application 1',
	reference: 'BC0110001',
	description: 'A description of test case 1 which is a case of subsector type Office Use'
};

const getPayload = ({ role = 'case-team', query = 'BC', pageNumber = 1, pageSize = 50 } = {}) => {
	return { role, query, pageNumber, pageSize };
};

const invalidRoleError = { errors: { role: 'Role is not valid' } };
const blankQueryError = { errors: { query: 'Query cannot be blank' } };

export { schema, request, applicationInfo, getPayload, invalidRoleError, blankQueryError };
