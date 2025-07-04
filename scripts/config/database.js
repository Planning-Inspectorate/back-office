/**
 * Database Configuration
 * Centralized database settings and commands
 */
module.exports = {
	containers: {
		standard: {
			name: 'pins_sql_server',
			image: 'mcr.microsoft.com/mssql/server:2019-CU27-ubuntu-20.04',
			profile: 'default',
			service: 'database'
		},
		arm64: {
			name: 'pins_sql_server_arm',
			image: 'mcr.microsoft.com/azure-sql-edge:latest',
			profile: 'arm64',
			service: 'database-arm'
		}
	},

	commands: {
		start: {
			standard: 'docker-compose --profile default up -d database',
			arm64: 'docker-compose --profile arm64 up -d database-arm'
		},
		stop: {
			universal: 'docker-compose --profile default --profile arm64 stop'
		},
		logs: {
			universal: 'docker-compose --profile default --profile arm64 logs -f'
		},
		shell: {
			standard: 'docker exec -it pins_sql_server bash',
			arm64: 'docker run --network db_network -it mcr.microsoft.com/mssql-tools'
		},
		cleanup: {
			containers: {
				unix: 'docker ps -aq --filter "name=pins_sql" | xargs -r docker rm -f',
				windows:
					'FOR /f "tokens=*" %i IN (\'docker ps -aq --filter "name=pins_sql"\') DO docker rm -f %i'
			},
			volumes: 'docker volume ls -q --filter "name=sql_data" | xargs -r docker volume rm'
		},
		status: {
			containers: 'docker-compose --profile default --profile arm64 ps',
			list: 'docker ps --filter "name=pins_sql" --format "{{.Names}}"'
		}
	},

	database: {
		name: 'pins_development',
		user: 'sa',
		password: 'd0ck3r_P@ssw0rd!',
		port: 1433
	},

	healthcheck: {
		timeout: 10000,
		retries: 30,
		interval: 2000
	}
};
