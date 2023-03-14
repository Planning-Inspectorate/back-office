// @ts-nocheck
import fs from 'node:fs';
import json from '../../../apps/api/src/server/swagger-output.json' assert { type: 'json' };

/**
 *
 * @param {JSON} swaggerJson
 * @returns {void}
 */
async function extractPathsAndSchemas(swaggerJson) {
	const pathsAndSchemas = {};

	for (const [path, pathObject] of Object.entries(swaggerJson.paths)) {
		for (const [method, methodObject] of Object.entries(pathObject)) {
			const response = methodObject.responses?.['200'];

			if (response?.schema) {
				const { schema } = response;

				if (schema?.$ref) {
					const referenceSchema = await getDefinitionSchema(swaggerJson, schema.$ref);

					if (referenceSchema) {
						pathsAndSchemas[path] = referenceSchema;
					}
				} else {
					pathsAndSchemas[path] = schema;
				}
			}
		}
	}
	fs.writeFileSync('./schemas/schema.json', JSON.stringify(pathsAndSchemas));
}

/**
 *
 * @param {JSON} swaggerJson
 * @param {string} reference
 * @returns {object}
 */
function getDefinitionSchema(swaggerJson, reference) {
	const definitionKey = reference.split('/').pop();
	const definition = swaggerJson.definitions[definitionKey];

	return definition;
}

void extractPathsAndSchemas(json);
