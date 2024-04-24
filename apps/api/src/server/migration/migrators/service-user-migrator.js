import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { databaseConnector } from '#utils/database-connector.js';
import { SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { groupBy, sendChunkedEvents } from './utils.js';

/**
 * @param {import('pins-data-model').Schemas.ServiceUser[]} serviceUsers
 */
export const migrateServiceUsers = async (serviceUsers) => {
	console.info(`Migrating ${serviceUsers.length} Service Users`);

	for (const serviceUser of serviceUsers) {
		const serviceUserEntity = mapModelToServiceUserEntity(serviceUser);
		const addressEntity = mapModelToAddressEntity(serviceUser);

		if (serviceUserEntity.id >= MigratedEntityIdCeiling) {
			throw Error(`Unable to migrate entity id=${serviceUserEntity.id} - identity above threshold`);
		}

		const { statement: serviceUserStatement, parameters: serviceUserParameters } =
			buildUpsertForEntity('ServiceUser', serviceUserEntity, 'id');

		console.info(`Upserting ServiceUser with ID ${serviceUserEntity.id}`);

		await databaseConnector.$transaction([
			databaseConnector.$executeRawUnsafe(serviceUserStatement, ...serviceUserParameters)
		]);

		await databaseConnector.$transaction(async (tx) => {
			await tx.serviceUser.update({
				where: {
					id: serviceUserEntity.id
				},
				data: {
					address: {
						upsert: {
							create: addressEntity,
							update: addressEntity
						}
					}
				}
			});

			if (serviceUser.serviceUserType === 'Applicant') {
				await tx.case.updateMany({
					where: {
						reference: serviceUser.caseReference
					},
					data: {
						applicantId: serviceUserEntity.id
					}
				});
			}
		});
	}

	const serviceUsersGroupedByType = groupServiceUsersByType(serviceUsers);
	await Promise.all(
		serviceUsersGroupedByType.map((groupedServiceUsers) => {
			return sendChunkedEvents(SERVICE_USER, groupedServiceUsers.serviceUsers, EventType.Publish, {
				entityType: groupedServiceUsers.serviceUserType
			});
		})
	);
	console.info(`Broadcasted ${serviceUsers.length} Service User PUBLISH events`);
};

/**
 * @param {import('pins-data-model').Schemas.ServiceUser} serviceUsers
 */
const mapModelToServiceUserEntity = ({
	id,
	firstName,
	lastName,
	organisation,
	role,
	telephoneNumber,
	emailAddress,
	webAddress
}) => {
	const parsedId = Number(id);
	if (!parsedId) throw `Invalid ServiceUser ID: ${id}`;

	return {
		id: parsedId,
		organisationName: organisation,
		firstName,
		lastName,
		email: emailAddress,
		website: webAddress,
		phoneNumber: telephoneNumber,
		jobTitle: role
	};
};

/**
 * @param {import('pins-data-model').Schemas.ServiceUser} serviceUsers
 */
const mapModelToAddressEntity = ({
	addressLine1,
	addressLine2,
	addressTown,
	addressCounty,
	postcode,
	addressCountry
}) => ({
	addressLine1,
	addressLine2,
	town: addressTown,
	county: addressCounty,
	postcode,
	country: addressCountry
});

/**
 *
 * @param {import('pins-data-model').Schemas.ServiceUser[]} serviceUserList
 * @returns {Array<{serviceUsers: import('pins-data-model').Schemas.ServiceUser[], serviceUserType: string}>} - An array of objects, each containing a group of service users and the value of the serviceUserType they were grouped by.
 */
const groupServiceUsersByType = (serviceUserList) => {
	return groupBy(serviceUserList, 'serviceUsers', 'serviceUserType');
};
