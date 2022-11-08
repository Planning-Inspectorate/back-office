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
				blobStoreUrl: '/application/1/D987654321/PINS1'
			}
		],
		Documents: [
			{
				name: 'filename.pdf',
				metadata: {
					documentType: 'application'
				}
			}
		]
	},
	components: {}
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = ['./src/server/app/routes.js'];

swaggerAutogen()(outputFile, endpointsFiles, document);
