import swaggerAutogen from 'swagger-autogen';

const document = {
	info: {
		version: '2.0',
		title: 'Document Storage API',
		description: 'Document Storage API documentation'
	},
	host: 'localhost:3001',
	basePath: '',
	schemes: [],
	consumes: [],
	produces: [],
	tags: [
		{
			name: '',
			description: ''
		}
	],
	securityDefinitions: {},
	definitions: {
		createBlobUrl: [
			{
				caseType: 'application',
				caseReference: '1',
				documentName: 'PINS1',
				GUID: 'D987654321',
				version: 1
			}
		],
		Documents: [
			{
				name: 'filename.pdf',
				metadata: {
					documentType: 'application'
				}
			}
		],
		createBlobUrlResponse: {
			blobStorageHost: 'Blob-Storage-Host',
			blobStorageContainer: 'Blob-Storage-Container',
			documents: [
				{
					blobStoreUrl: '/some/path/to/document/PINS1',
					caseType: 'application',
					caseReference: '1',
					documentName: 'PINS1',
					GUID: 'D987654321'
				}
			]
		}
	},
	components: {}
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = ['./src/server/app/routes.js'];

swaggerAutogen()(outputFile, endpointsFiles, document);
