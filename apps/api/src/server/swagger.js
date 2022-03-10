import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		version: '2.0',      // by default: '1.0.0'
		title: 'My PINS Project',        // by default: 'REST API'
		description: 'My PINS Project AOI documentation from Swagger',  // by default: ''
	},
	host: 'localhost:3000',      // by default: 'localhost:3000'
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
	definitions: {},          // by default: empty object
	components: {}            // by default: empty object (OpenAPI 3.x)
};

const outputFile = './src/server/swagger-output.json';
const endpointsFiles = ['./src/server/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
