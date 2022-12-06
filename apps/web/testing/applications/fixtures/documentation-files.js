import { createDocumentationFile } from '../factory/documentation-file.js';

export const fixtureDocumentationFiles = [...Array.from({ length: 123 }).keys()].map((index) =>
	createDocumentationFile({ guid: `${index}` })
);
