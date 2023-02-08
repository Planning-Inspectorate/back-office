import { jest } from '@jest/globals';

const mockCaseFindUnique = jest.fn();
const mockCaseUpdate = jest.fn();
const mockZoomLevelFindUnique = jest.fn();
const mockSubSectorFindUnique = jest.fn();
const mockServiceCustomerFindUnique = jest.fn();
const mockRegionFindUnique = jest.fn();
const mockRegionsOnApplicationDetailsDeleteMany = jest.fn();

class MockPrismaClient {
	get case() {
		return {
			findUnique: mockCaseFindUnique,
			update: mockCaseUpdate
		};
	}

	get zoomLevel() {
		return {
			findUnique: mockZoomLevelFindUnique
		};
	}

	get subSector() {
		return {
			findUnique: mockSubSectorFindUnique
		};
	}

	get serviceCustomer() {
		return {
			findUnique: mockServiceCustomerFindUnique
		};
	}

	get region() {
		return {
			findUnique: mockRegionFindUnique
		};
	}

	get regionsOnApplicationDetails() {
		return {
			deleteMany: mockRegionsOnApplicationDetailsDeleteMany
		};
	}

	$transaction() {
		return {};
	}

	$executeRawUnsafe() {
		return {};
	}
}

jest.unstable_mockModule('@prisma/client', () => ({
	default: {
		PrismaClient: MockPrismaClient
	}
}));

const mockSendEvents = jest.fn();

jest.unstable_mockModule('./src/server/infrastructure/event-client.js', () => ({
	eventClient: {
		sendEvents: mockSendEvents
	}
}));
