import { defineConfig } from 'prisma/config';
import path from 'node:path';
import dotenv from 'dotenv';

// load configuration from .env file into process.env
dotenv.config();

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
