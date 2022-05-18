import swaggerAutogen from 'swagger-autogen';

const document_ = {
	info: {
		version: '2.0',      // by default: '1.0.0'
		title: 'Document Storage API',        // by default: 'REST API'
		description: 'Document Storage API documentation',  // by default: ''
	},
	host: 'localhost:3001',      // by default: 'localhost:3000'
	basePath: '',  // by default: '/'
	schemes: [],   // by default: ['http']
	consumes: [],  // by default: ['application/json']
	produces: [],  // by default: ['application/json']
	tags: [        // by default: empty Array
		{
			name: '',         // Tag name
			description: '',  // Tag description
		},
		// { ... }
	],
	securityDefinitions: {},  // by default: empty object (Swagger 2.0)
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

swaggerAutogen()(outputFile, endpointsFiles, document_);
