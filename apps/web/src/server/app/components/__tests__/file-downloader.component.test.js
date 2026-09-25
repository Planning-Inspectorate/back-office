// @ts-nocheck
import { jest } from '@jest/globals';
import http from 'node:http';
import {
	buildContentDispositionHeader,
	getSimulatedDocumentsDownload
} from '../file-downloader.component.js';

describe('file-downloader.component', () => {
	describe('content-disposition header', () => {
		const filename = 'test — document.pdf';
		const encodedFilename = encodeURIComponent(filename);

		it('should allow URI encoded special characters in filename*', () => {
			const response = new http.ServerResponse({
				method: 'GET'
			});

			expect(() => {
				response.setHeader(
					'content-disposition',
					`attachment; filename*=UTF-8''${encodedFilename}`
				);
			}).not.toThrow();
		});

		it('should reject raw special characters in filename', () => {
			const response = new http.ServerResponse({
				method: 'GET'
			});

			expect(() => {
				response.setHeader(
					'content-disposition',
					`attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`
				);
			}).toThrow('Invalid character in header content');
		});
	});

	describe('getSimulatedDocumentsDownload', () => {
		let response;

		beforeEach(() => {
			response = {
				setHeader: jest.fn(),
				write: jest.fn(),
				end: jest.fn(),
				status: jest.fn().mockReturnThis()
			};
		});

		it('should download a document with the expected filename', () => {
			getSimulatedDocumentsDownload(response, undefined, 'test-document.pdf', 'test-document.pdf');

			expect(response.setHeader).toHaveBeenCalledWith(
				'content-disposition',
				`attachment; filename="test-document.pdf"; filename*=UTF-8''test-document.pdf`
			);

			expect(response.write).toHaveBeenCalledWith('DUMMY DATA');
			expect(response.end).toHaveBeenCalled();
			expect(response.status).toHaveBeenCalledWith(200);
		});

		it('should URI encode special characters in filename*', () => {
			getSimulatedDocumentsDownload(
				response,
				undefined,
				'test — document.pdf',
				'test — document.pdf'
			);

			expect(response.setHeader).toHaveBeenCalledWith(
				'content-disposition',
				`attachment; filename="test - document.pdf"; filename*=UTF-8''test%20%E2%80%94%20document.pdf`
			);
		});

		it('should not set content-disposition when previewing a document', () => {
			getSimulatedDocumentsDownload(response, 'true', 'test-document.pdf', 'test-document.pdf');

			expect(response.setHeader).toHaveBeenCalledWith('Content-type', 'text/plain');

			expect(response.setHeader).not.toHaveBeenCalledWith('content-disposition', expect.anything());
		});

		it('should use the original file extension when the filename has no extension', () => {
			getSimulatedDocumentsDownload(response, undefined, 'test-document', 'original.pdf');

			expect(response.setHeader).toHaveBeenCalledWith(
				'content-disposition',
				`attachment; filename="test-document.pdf"; filename*=UTF-8''test-document.pdf`
			);
		});

		it('should allow a document with special characters in the filename to be downloaded', () => {
			const response = new http.ServerResponse({
				method: 'GET'
			});

			response.write = jest.fn();
			response.end = jest.fn();
			response.status = jest.fn().mockReturnThis();

			expect(() => {
				getSimulatedDocumentsDownload(
					response,
					undefined,
					'test — document.pdf',
					'test — document.pdf'
				);
			}).not.toThrow();
		});
	});

	describe('buildContentDispositionHeader', () => {
		it('should build the header for a standard filename', () => {
			expect(buildContentDispositionHeader('test document.pdf')).toBe(
				`attachment; filename="test document.pdf"; filename*=UTF-8''test%20document.pdf`
			);
		});

		it('should replace non-ASCII characters in the fallback filename', () => {
			expect(buildContentDispositionHeader('test — document.pdf')).toBe(
				`attachment; filename="test - document.pdf"; filename*=UTF-8''test%20%E2%80%94%20document.pdf`
			);
		});

		it('should preserve Latin-1 characters in the fallback filename', () => {
			expect(buildContentDispositionHeader('£500 Résumé.pdf')).toBe(
				`attachment; filename="£500 Résumé.pdf"; filename*=UTF-8''%C2%A3500%20R%C3%A9sum%C3%A9.pdf`
			);
		});
	});
});
