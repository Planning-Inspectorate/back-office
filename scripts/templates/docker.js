/**
 * Docker Templates
 */
class DockerTemplates {
	generateCompose(config) {
		return `version: '3.8'

services:
  # Standard SQL Server for x64 systems
  database:
    image: mcr.microsoft.com/mssql/server:2019-CU27-ubuntu-20.04
    container_name: pins_sql_server
    hostname: pins_sql_server
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=${config.database.password}
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - sql_data:/var/opt/mssql
    healthcheck:
      test: ["CMD-SHELL", "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P '${config.database.password}' -Q 'SELECT 1'"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    profiles:
      - default

  # ARM64 SQL Server (Azure SQL Edge) for M1 Macs
  database-arm:
    image: mcr.microsoft.com/azure-sql-edge:latest
    container_name: pins_sql_server_arm
    hostname: pins_sql_server_arm
    environment:
      - ACCEPT_EULA=1
      - MSSQL_SA_PASSWORD=${config.database.password}
    ports:
      - "1433:1433"
    volumes:
      - sql_data_arm:/var/opt/mssql
    cap_add:
      - SYS_PTRACE
    networks:
      - db_network
    healthcheck:
      test: ["CMD-SHELL", "sleep 5"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    profiles:
      - arm64

  # Database creation service
  db-create:
    image: mcr.microsoft.com/mssql/server:2019-CU27-ubuntu-20.04
    depends_on:
      database:
        condition: service_healthy
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=${config.database.password}
    command: >
      bash -c "
        sleep 10 &&
        /opt/mssql-tools/bin/sqlcmd -S pins_sql_server -U sa -P '${config.database.password}' -Q 'CREATE DATABASE ${config.database.name}' &&
        echo 'Database created successfully'
      "
    profiles:
      - default

  # Database creation for ARM64
  db-create-arm:
    image: mcr.microsoft.com/mssql-tools
    depends_on:
      - database-arm
    networks:
      - db_network
    command: >
      bash -c "
        sleep 30 &&
        sqlcmd -S pins_sql_server_arm -U sa -P '${config.database.password}' -Q 'CREATE DATABASE ${config.database.name}' &&
        echo 'Database created successfully'
      "
    profiles:
      - arm64

volumes:
  sql_data:
    driver: local
  sql_data_arm:
    driver: local

networks:
  db_network:
    driver: bridge
`;
	}
}

/**
 * Environment Templates
 * Generates the values that need to be updated
 */
class EnvironmentTemplates {
	/**
	 * Generate ALL API values that need updating from setup.js
	 */
	generateApiUpdates(config) {
		// Get the API config from setup.js
		const setupConfig = require('../config/setup');

		return {
			// Static values from setup.js
			...setupConfig.environment.api,

			// Dynamic values based on user input (overwrite any static values)
			DATABASE_URL: `"sqlserver://127.0.0.1:1433;database=${config.database.name};user=sa;password=${config.database.password};trustServerCertificate=true"`,
			PORT: config.api.port
		};
	}

	/**
	 * Generate ALL Web values that need updating from setup.js
	 */
	generateWebUpdates(config) {
		// Get the Web config from setup.js
		const setupConfig = require('../config/setup');

		return {
			// Static values from setup.js
			...setupConfig.environment.web,

			// Dynamic values based on user input (overwrite any static values)
			API_HOST: `http://localhost:${config.api.port}`,
			HTTP_PORT: config.web.port,
			SESSION_SECRET: config.web.sessionSecret,
			APP_HOSTNAME: `localhost:${config.web.port}`
		};
	}

	// Keep the old complete methods for backward compatibility
	generateApiEnv(config) {
		const setupConfig = require('../config/setup');

		return {
			...setupConfig.environment.api,
			NODE_ENV: 'development',
			PORT: config.api.port,
			DATABASE_URL: `"sqlserver://127.0.0.1:1433;database=${config.database.name};user=sa;password=${config.database.password};trustServerCertificate=true"`,
			QUERY_BATCH_SIZE: '2090'
		};
	}

	generateWebEnv(config) {
		const setupConfig = require('../config/setup');

		return {
			// Static values from setup.js
			...setupConfig.environment.web,

			// Dynamic values (overwrite any static values)
			API_HOST: `http://localhost:${config.api.port}`,
			APP_HOSTNAME: `localhost:${config.web.port}`,
			HTTP_PORT: config.web.port,
			HTTPS_PORT: config.web.port,
			SESSION_SECRET: config.web.sessionSecret
		};
	}
}

// Export both classes
module.exports = { DockerTemplates, EnvironmentTemplates };
