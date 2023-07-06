// @ts-nocheck
import fs from 'node:fs/promises';
import json from '../../../apps/api/src/server/swagger-output.json' assert { type: 'json' };

const extractSwaggerInfo = (swaggerDoc) => {
	const extractedData = [];

	for (const [path, methods] of Object.entries(swaggerDoc.paths)) {
		for (const [method, schema] of Object.entries(methods)) {
			const { responses = {}, parameters = [] } = schema;

			const responseSchemas = Object.entries(responses).reduce((acc, [key, response]) => {
				const responseSchema = response.schema || {};
				const responseSchemaResolved = resolveSchemaRefs(swaggerDoc, responseSchema);
				return { ...acc, [key]: responseSchemaResolved };
			}, {});

			const parameterSchemas = parameters.map((param) => {
				if (param.hasOwnProperty('schema') && param.schema.hasOwnProperty('$ref')) {
					return resolveSchemaRefs(swaggerDoc, param.schema);
				} else {
					return param;
				}
			});

			extractedData.push({
				path,
				method,
				responses: responseSchemas,
				parameters: parameterSchemas
			});
		}
	}

	return extractedData;
};

const resolveSchemaRefs = (swaggerDoc, schema) => {
	if (schema && schema.hasOwnProperty('$ref')) {
		const ref = schema.$ref;
		const [_, definitionName] = ref.split('#/definitions/');
		return { schema: swaggerDoc.definitions[definitionName] };
	}
	return { schema };
};

(async () => {
	const swaggerDoc = json;
	const extractedData = extractSwaggerInfo(swaggerDoc);

	for (const data of extractedData) {
		const json = JSON.stringify(data, null, 2);

		const fileName = data.path.replace(/^\/|\/$/g, '').replace(/\//g, '-');
		await fs.writeFile(`./schemas/${fileName}-${data.method}.json`, json);
	}
})();
