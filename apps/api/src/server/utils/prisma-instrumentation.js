import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import logger from '#utils/logger.js';
import config from '../config/config.js';

export function initialisePrismaInstrumentation() {
	if (!config.APPLICATIONINSIGHTS_CONNECTION_STRING) {
		logger.warn(
			'Skipped initialising Prisma instrumentation as `APPLICATIONINSIGHTS_CONNECTION_STRING` is undefined. If running locally, this is expected.'
		);
		return;
	}

	const provider = new NodeTracerProvider({
		resource: new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: 'back-office-prisma'
		})
	});

	const exporter = new AzureMonitorTraceExporter({
		connectionString: config.APPLICATIONINSIGHTS_CONNECTION_STRING
	});

	provider.addSpanProcessor(new BatchSpanProcessor(exporter));

	registerInstrumentations({
		tracerProvider: provider,
		instrumentations: [new PrismaInstrumentation()]
	});

	provider.register();

	logger.info('Successfully initialised Prisma instrumentation.');
}
