import swaggerAutogen from 'swagger-autogen';

const document = {
	info: {
		version: '2.0',
		title: 'Document Storage API',
		description: 'Document Storage API documentation',
	},
	host: 'localhost:3001',
	basePath: '',
	schemes: [],
	consumes: [],
	produces: [],
	tags: [
		{
			name: '',
			description: '',
		},
	],
	securityDefinitions: {},
	definitions: {
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
const endpointsFiles = ['./src/server/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, document);
