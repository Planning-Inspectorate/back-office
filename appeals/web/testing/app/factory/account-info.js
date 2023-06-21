import { faker } from '@faker-js/faker';
import { camelCase, snakeCase } from 'lodash-es';

/** @typedef {import('@pins/platform').PlanningInspectorAccountInfo} AccountInfo */
/** @typedef {Omit<AccountInfo, 'idTokenClaims'> & { groups?: string[] }} AccountInfoOptions */

/**
 * @param {Partial<AccountInfoOptions>} [options={}]
 * @returns {AccountInfo}
 */
export function createAccountInfo({
	homeAccountId = faker.datatype.uuid(),
	name = `${faker.name.firstName()} ${faker.name.lastName()}`,
	environment = 'login.planninginspectorate.gov.uk',
	tenantId = 'PlanningInspectorate',
	username = snakeCase(name),
	localAccountId = camelCase(name),
	groups = [
		'appeals_case_officer',
		'appeals_inspector',
		'appeals_validation_officer',
		'applications_case_team',
		'applications_case_admin_officer',
		'applications_inspector'
	]
} = {}) {
	return {
		homeAccountId,
		environment,
		tenantId,
		username,
		localAccountId,
		name,
		idTokenClaims: {
			groups
		}
	};
}
