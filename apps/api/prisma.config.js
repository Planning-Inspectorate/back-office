import { defineConfig } from 'prisma/config';
import path from 'node:path';
import { loadEnvFile } from 'node:process';

// load configuration from .env file into process.env
// prettier-ignore
try { loadEnvFile(); } catch {/* ignore errors*/}

export default defineConfig({
	schema: path.join('src', 'database', 'schema.prisma'),
	migrations: {
		path: path.join('src', 'database', 'migrations'),
		seed: 'node src/database/seed/seed-development.js'
	},
	datasource: {
		url: process.env.DATABASE_URL || ''
	}
});
