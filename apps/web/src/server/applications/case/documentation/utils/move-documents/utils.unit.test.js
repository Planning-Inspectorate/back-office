//@ts-nocheck
import utils from './utils';

const mockSession = {
	moveDocuments: {}
};
describe('utils.js', () => {
	describe('#getFolderViewData', () => {
		it('should map folder view data to expected format', () => {
			const folderList = [{ id: 1, displayNameEn: 'Folder 1' }];
			const result = utils.getFolderViewData(folderList);

			expect(result).toEqual([{ text: 'Folder 1', value: 1 }]);
		});
	});

	describe('#isFolderRoot', () => {
		it('should return true if all folders are root folders', () => {
			const folderList = [{ parentFolderId: null }];
			const result = utils.isFolderRoot(folderList);

			expect(result).toBe(true);
		});

		it('should return false if not all folders are root folders', () => {
			const folderList = [{ parentFolderId: 1 }];
			const result = utils.isFolderRoot(folderList);

			expect(result).toBe(false);
		});
	});

	describe('#formatFolderList', () => {
		it('should return sorted and filtered folder list', () => {
			const folderList = [
				{ displayNameEn: 'Folder 2', displayOrder: 2 },
				{ displayNameEn: 'Folder 1', displayOrder: 1 },
				{ displayNameEn: 'relevant representations', displayOrder: 3 }
			];
			const result = utils.formatFolderList(folderList);

			expect(result).toEqual([
				{ displayNameEn: 'Folder 1', displayOrder: 1 },
				{ displayNameEn: 'Folder 2', displayOrder: 2 }
			]);
		});
	});

	describe('#getFolderNameById', () => {
		it('should return folder name by id', () => {
			const folderList = [{ id: 1, displayNameEn: 'Folder 1' }];
			const result = utils.getFolderNameById(folderList, 1);

			expect(result).toBe('Folder 1');
		});

		it('should return undefined if folder id is not found', () => {
			const folderList = [{ id: 1, displayNameEn: 'Folder 1' }];
			const result = utils.getFolderNameById(folderList, 2);

			expect(result).toBeUndefined();
		});
	});

	describe('#buildMoveDocumentsBreadcrumbItems', () => {
		it('should return empty array if the are no breadcrumbs in the session', () => {
			//documentationSessionHandlers.getSessionMoveDocumentsBreadcrumbs = jest.fn().mockReturnValue(null);
			const result = utils.buildMoveDocumentsBreadcrumbItems(mockSession, 1, 'Folder 1');

			expect(result).toEqual([]);
		});

		it('should return empty array if parentFolderId is not provided', () => {
			const result = utils.buildMoveDocumentsBreadcrumbItems(mockSession, null, 'Folder 1');

			expect(result).toEqual([]);
		});

		it('should add root folder to breadcrumbs as a first item', () => {
			mockSession.moveDocuments.breadcrumbs = [];

			const result = utils.buildMoveDocumentsBreadcrumbItems(mockSession, 1, 'Folder 1');
			console.log('test res:>> ', result);
			//FINISHED THIS, strat with next
			expect(result[0]).toEqual({
				href: './folder-explorer',
				html: '<span class="folder-icon"></span>Project documentation',
				id: 0
			});
		});

		it('should trim breadcrumbs to current folder (user went back to previous folder)', () => {
			mockSession.moveDocuments.breadcrumbs = [
				{ href: './folder-explorer', html: 'Project documentation', id: 0 },
				{ href: './folder-explorer?parentFolderId=1&parentFolderName=Folder 1', html: 'Folder 1', id: 1 },
				{ href: './folder-explorer?parentFolderId=2&parentFolderName=Folder 2', html: 'Folder 2', id: 2 }
			];
			const result = utils.buildMoveDocumentsBreadcrumbItems(mockSession, 1, 'Folder 1');

			expect(result).toEqual([
				{ href: './folder-explorer', html: '<span class="folder-icon"></span>Project documentation', id: 0 },
				{ href: './folder-explorer?parentFolderId=1&parentFolderName=Folder 1', html: '<span class="folder-icon"></span>Folder 1', id: 1 }
			]);
		});
	});

	describe('#getBackLinkUrlFromBreadcrumbs', () => {
		describe('if there are no breadcrumb items', () => {
			it('should return baseURL/move-documents if the are no breadcrumbs', () => {
				const result = utils.getBackLinkUrlFromBreadcrumbs(null, 1, 1, 'Folder 1');
	
				expect(result).toBe(
					'/applications-service/case/1/project-documentation/1/folder-1/move-documents'
				);
			});
		});

		describe('if there is more than one breadcrumb item', () => {
			it('should return base URL/move-documents and folder page params for the second to last item from existing breadcrumbs', () => {
				const breadcrumbItems = [
					{ href: './folder-explorer', text: 'Project documentation' },
					{ href: './folder-explorer?parentFolderId=1&parentFolderName=Folder 1', text: 'Folder 1' },
					{ href: './folder-explorer?parentFolderId=2&parentFolderName=Folder 2', text: 'Folder 2' }
				];
				const result = utils.getBackLinkUrlFromBreadcrumbs(breadcrumbItems, 111111, 1, 'Folder 1');
	
				expect(result).toBe(
					'/applications-service/case/111111/project-documentation/1/folder-1/move-documents/folder-explorer?parentFolderId=1&parentFolderName=Folder 1'
				);
			});
		});

	});
});
