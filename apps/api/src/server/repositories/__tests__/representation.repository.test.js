import { jest } from '@jest/globals';
import * as representationRepository from '../representation.repository.js';
import { databaseConnector } from '#utils/database-connector.js';

jest.mock('#utils/database-connector.js', () => ({
	databaseConnector: {
		representation: {
			count: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			groupBy: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			updateMany: jest.fn()
		},
		representationAction: {
			create: jest.fn()
		},
		representationAttachment: {
			upsert: jest.fn(),
			delete: jest.fn()
		},
		$transaction: jest.fn()
	}
}));

describe('representation.repository', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getByCaseId', () => {
		it('should return count and items from transaction', async () => {
			databaseConnector.$transaction = jest.fn().mockResolvedValue([42, [{ id: 1 }]]);
			const result = await representationRepository.getByCaseId(1, { page: 1, pageSize: 10 }, {});
			expect(result).toEqual({ count: 42, items: [{ id: 1 }] });
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('getById', () => {
		it('should call findUnique with correct params', async () => {
			databaseConnector.representation.findUnique.mockResolvedValue({ id: 1 });
			const result = await representationRepository.getById(1);
			expect(result).toEqual({ id: 1 });
			expect(databaseConnector.representation.findUnique).toHaveBeenCalledWith(
				expect.objectContaining({ where: { id: 1 } })
			);
		});
	});

	describe('getFirstById', () => {
		it('should call findFirst with id only', async () => {
			databaseConnector.representation.findFirst.mockResolvedValue({ id: 1 });
			const result = await representationRepository.getFirstById(1);
			expect(result).toEqual({ id: 1 });
			expect(databaseConnector.representation.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
		});
		it('should call findFirst with id and caseId', async () => {
			databaseConnector.representation.findFirst.mockResolvedValue({ id: 1, caseId: 2 });
			const result = await representationRepository.getFirstById(1, 2);
			expect(result).toEqual({ id: 1, caseId: 2 });
			expect(databaseConnector.representation.findFirst).toHaveBeenCalledWith({
				where: { id: 1, caseId: 2 }
			});
		});
	});

	describe('getStatusCountByCaseId', () => {
		it('should call groupBy and count, then $transaction', async () => {
			databaseConnector.representation.groupBy.mockReturnValue('grouped');
			databaseConnector.representation.count.mockReturnValue('counted');
			databaseConnector.$transaction = jest.fn().mockResolvedValue(['grouped', 'counted']);
			const result = await representationRepository.getStatusCountByCaseId(1);
			expect(result).toEqual(['grouped', 'counted']);
			expect(databaseConnector.$transaction).toHaveBeenCalledWith(['grouped', 'counted']);
		});
	});

	describe('deleteApplicationRepresentationAttachment', () => {
		beforeEach(() => {
			databaseConnector.representationAttachment.delete.mockResolvedValue('deleted');
			databaseConnector.representation.update = jest.fn();
			databaseConnector.$transaction = jest.fn().mockResolvedValue(['deleted']);
		});
		it('should delete attachment and not update rep if not published', async () => {
			databaseConnector.representation.findFirst.mockResolvedValue({ id: 1, status: 'DRAFT' });
			const result = await representationRepository.deleteApplicationRepresentationAttachment(1, 2);
			expect(result).toBe('deleted');
			expect(databaseConnector.representationAttachment.delete).toHaveBeenCalledWith({
				where: { id: 2 }
			});
			expect(databaseConnector.representation.update).not.toHaveBeenCalled();
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
		it('should delete attachment and update rep if published', async () => {
			databaseConnector.representation.findFirst.mockResolvedValue({ id: 1, status: 'PUBLISHED' });
			databaseConnector.representation.update.mockResolvedValue('updated');
			const result = await representationRepository.deleteApplicationRepresentationAttachment(1, 2);
			expect(result).toBe('deleted');
			expect(databaseConnector.representationAttachment.delete).toHaveBeenCalledWith({
				where: { id: 2 }
			});
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { unpublishedUpdates: true }
			});
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('updateApplicationRepresentationStatusById', () => {
		it('should update status and add action, unpublished true', async () => {
			databaseConnector.representation.update.mockReturnValue('updated');
			databaseConnector.representationAction.create.mockReturnValue('action');
			databaseConnector.$transaction = jest.fn().mockResolvedValue(['updated']);
			const rep = { id: 1, status: 'DRAFT', unpublishedUpdates: true };
			const action = { status: 'VALID' };
			const result = await representationRepository.updateApplicationRepresentationStatusById(
				rep,
				action,
				true
			);
			expect(result).toBe('updated');
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'VALID', unpublishedUpdates: false }
			});
			expect(databaseConnector.representationAction.create).toHaveBeenCalled();
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
		it('should update status and add action, unpublished false', async () => {
			databaseConnector.representation.update.mockReturnValue('updated');
			databaseConnector.representationAction.create.mockReturnValue('action');
			databaseConnector.$transaction = jest.fn().mockResolvedValue(['updated']);
			const rep = { id: 1, status: 'DRAFT', unpublishedUpdates: true };
			const action = { status: 'VALID' };
			const result = await representationRepository.updateApplicationRepresentationStatusById(
				rep,
				action,
				false
			);
			expect(result).toBe('updated');
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'VALID', unpublishedUpdates: true }
			});
			expect(databaseConnector.representationAction.create).toHaveBeenCalled();
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('setRepresentationsStatus', () => {
		it('should update and create actions for fromStatus, updateMany for toStatus', async () => {
			databaseConnector.representation.update = jest.fn();
			databaseConnector.representationAction.create = jest.fn();
			databaseConnector.representation.updateMany = jest.fn();
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);
			const reps = [
				{ id: 1, status: 'FROM' },
				{ id: 2, status: 'TO' }
			];
			await representationRepository.setRepresentationsStatus(reps, 'user', 'FROM', 'TO');
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'TO' }
			});
			expect(databaseConnector.representationAction.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						representationId: 1,
						previousStatus: 'FROM',
						type: 'STATUS',
						status: 'TO',
						actionBy: 'user'
					})
				})
			);
			expect(databaseConnector.representation.updateMany).toHaveBeenCalledWith({
				where: { id: { in: [2] } },
				data: { unpublishedUpdates: false }
			});
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('setRepresentationsStatusBatch', () => {
		it('should call setRepresentationsStatus in batches', async () => {
			const reps = Array.from({ length: 1500 }, (_, i) => ({ id: i + 1, status: 'FROM' }));
			const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
			await representationRepository.setRepresentationsStatusBatch(reps, 'user', 'FROM', 'TO');
			expect(infoSpy).toHaveBeenCalledWith('updated representations from range 0 - 1000');
			expect(infoSpy).toHaveBeenCalledWith('updated representations from range 1000 - 1500');
			infoSpy.mockRestore();
		});
	});

	describe('setRepresentationsAsPublished', () => {
		it('should update representations from VALID to PUBLISHED', async () => {
			databaseConnector.representation.update = jest.fn();
			databaseConnector.representationAction.create = jest.fn();
			databaseConnector.representation.updateMany = jest.fn();
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);
			const reps = [
				{ id: 1, status: 'VALID' },
				{ id: 2, status: 'PUBLISHED' }
			];
			await representationRepository.setRepresentationsAsPublished(reps, 'user');
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'PUBLISHED' }
			});
			expect(databaseConnector.representationAction.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						representationId: 1,
						previousStatus: 'VALID',
						type: 'STATUS',
						status: 'PUBLISHED',
						actionBy: 'user'
					})
				})
			);
			expect(databaseConnector.representation.updateMany).toHaveBeenCalledWith({
				where: { id: { in: [2] } },
				data: { unpublishedUpdates: false }
			});
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('setRepresentationsAsUnpublished', () => {
		it('should update representations from PUBLISHED to UNPUBLISHED', async () => {
			databaseConnector.representation.update = jest.fn();
			databaseConnector.representationAction.create = jest.fn();
			databaseConnector.representation.updateMany = jest.fn();
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);
			const reps = [
				{ id: 1, status: 'PUBLISHED' },
				{ id: 2, status: 'UNPUBLISHED' }
			];
			await representationRepository.setRepresentationsAsUnpublished(reps, 'user');
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'UNPUBLISHED' }
			});
			expect(databaseConnector.representationAction.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						representationId: 1,
						previousStatus: 'PUBLISHED',
						type: 'STATUS',
						status: 'UNPUBLISHED',
						actionBy: 'user'
					})
				})
			);
			expect(databaseConnector.representation.updateMany).toHaveBeenCalledWith({
				where: { id: { in: [2] } },
				data: { unpublishedUpdates: false }
			});
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('setRepresentationsAsPublishedBatch', () => {
		it('should batch update representations from VALID to PUBLISHED', async () => {
			const reps = Array.from({ length: 1200 }, (_, i) => ({ id: i + 1, status: 'VALID' }));
			const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
			await representationRepository.setRepresentationsAsPublishedBatch(reps, 'user');
			expect(infoSpy).toHaveBeenCalledWith('updated representations from range 0 - 1000');
			expect(infoSpy).toHaveBeenCalledWith('updated representations from range 1000 - 1200');
			infoSpy.mockRestore();
		});
	});

	describe('setRepresentationsAsUnpublishedBatch', () => {
		it('should batch update representations from PUBLISHED to UNPUBLISHED', async () => {
			const reps = Array.from({ length: 1200 }, (_, i) => ({ id: i + 1, status: 'PUBLISHED' }));
			const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
			await representationRepository.setRepresentationsAsUnpublishedBatch(reps, 'user');
			expect(infoSpy).toHaveBeenCalledWith('updated representations from range 0 - 1000');
			expect(infoSpy).toHaveBeenCalledWith('updated representations from range 1000 - 1200');
			infoSpy.mockRestore();
		});
	});
});
