// @ts-nocheck
import get from '../../schemas/applications-subscriptions-get.json' assert { type: 'json' };
import put from '../../schemas/applications-subscriptions-put.json' assert { type: 'json' };
import patch from '../../schemas/applications-subscriptions-{id}-patch.json' assert { type: 'json' };

import { TestService } from '../../services/test-service.js';

export const {
	responses: { 200: getResponse200, 400: getResponse400, 404: getResponse404 },
	path: endpoint
} = get;

export const {
	responses: { 200: putResponse200, 201: putResponse201, 400: putResponse400 }
} = put;

export const {
	responses: { 200: patchResponse200, 400: patchResponse400, 404: patchResponse404 }
} = patch;

export const request = new TestService(endpoint);
