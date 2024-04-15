import { createFolders } from '#repositories/folder.repository.js';
import { createRepresentation } from './data-test.js';

/**
 *
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export const createGeneralS51Application = async (databaseConnector) => {
	try {
		//1 check if case already exists
		const caseExists = await databaseConnector.case.findMany({
			where: { reference: 'GS5110001' }
		});

		//if we have more than one GS51 case, something went wrong and it will need to be corrected
		if (caseExists.length > 1)
			throw new Error('Found more than one GS51 case. There should be only one');

		//if one case already exists, we can stop here
		if (caseExists.length == 1) {
			console.log('GS51 case already exists');
			return;
		}

		//2 when case doesn't exists, create sector and subsector for it
		await databaseConnector.sector.upsert({
			create: {
				name: 'general',
				abbreviation: 'GS51',
				displayNameEn: 'General',
				displayNameCy: 'General'
			},
			where: { name: 'general' },
			update: {}
		});

		await databaseConnector.subSector.upsert({
			create: {
				name: 'general',
				abbreviation: 'GS51',
				displayNameEn: 'Section 51 Advice',
				displayNameCy: 'Section 51 Advice',
				sector: { connect: { name: 'general' } }
			},
			update: {},
			where: { name: 'general' }
		});

		let representations = [createRepresentation('GS5110001', 1)];

		//3 then create the case
		const GS51_case = await databaseConnector.case.create({
			data: {
				reference: 'GS5110001',
				modifiedAt: new Date(),
				description: `A container case for general S51 advice`,
				title: 'General Section 51 Advice',
				ApplicationDetails: {
					create: {
						subSector: {
							connect: {
								name: 'general'
							}
						},
						regions: {
							create: [
								{
									region: {
										connect: {
											name: 'london'
										}
									}
								}
							]
						},
						zoomLevel: {
							connect: {
								name: 'country'
							}
						}
					}
				},
				CaseStatus: {
					create: [
						{
							status: 'pre-application'
						}
					]
				},
				applicant: {
					create: {}
				},
				Representation: {
					create: representations
				}
			}
		});

		//4. Cleanup: remove sector and subsector if case created ok as they are no longer needed
		await databaseConnector.subSector.deleteMany({
			where: {
				name: 'general',
				abbreviation: 'GS51'
			}
		});
		await databaseConnector.sector.deleteMany({
			where: {
				name: 'general',
				abbreviation: 'GS51'
			}
		});

		await Promise.all(createFolders(GS51_case.id)); //TODO: create just s51 folder?
	} catch (error) {
		console.log(error);
		throw error;
	}
};
