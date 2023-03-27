// @ts-nocheck
import data from '../../schemas/applications-zoom-level-get.json' assert { type: 'json' };
import { TestService } from '../../services/test-service.js';

const schema = data.responses[200].schema;
const { path: endpoint } = data;
const request = new TestService(endpoint);

export { endpoint, request, schema };
