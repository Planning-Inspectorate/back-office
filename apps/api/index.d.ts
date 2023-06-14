import * as Appeals from './src/server/appeals/appeals';
import * as Schema from './src/database/schema';

export { Appeals, Schema };

export type CaseType = 'application' | 'document';
