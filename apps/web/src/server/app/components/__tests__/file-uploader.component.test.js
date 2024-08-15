// @ts-nocheck
import { jest } from '@jest/globals';
import { postValidateFileSignatures } from '../file-uploader.component.js';

describe('file-uploader.component', () => {
	describe('postValidateFileSignatures', () => {
		let request, response;
		beforeEach(() => {
			response = { send: jest.fn().mockResolvedValue() };
		});

		it('should send invalid signature when unknown filetype', async () => {
			request = { body: [{ fileRowId: '01', fileType: 'unknown', hexSignature: 'ABCDEFGHIJKL' }] };
			await postValidateFileSignatures(request, response);
			expect(response.send).toHaveBeenCalledWith({
				invalidSignatures: ['01']
			});
		});

		it('should send no invalid signatures', async () => {
			request = {
				body: [
					{ fileRowId: '01', fileType: 'application/pdf', hexSignature: '255044462DGF' },
					{ fileRowId: '02', fileType: 'application/msword', hexSignature: 'D0CF11E0ADEA' },
					{
						fileRowId: '03',
						fileType: 'application/vnd.ms-powerpoint',
						hexSignature: 'D0CF11E000'
					},
					{ fileRowId: '04', fileType: 'video/mpeg', hexSignature: '000001B300' },
					{ fileRowId: '05', fileType: 'video/mpeg', hexSignature: '000001BACC' },
					{ fileRowId: '06', fileType: 'audio/mpeg', hexSignature: 'FFFB01B300' },
					{ fileRowId: '07', fileType: 'audio/mpeg', hexSignature: '494433BACC' },
					{ fileRowId: '08', fileType: 'video/mp4', hexSignature: 'ABCD013466747970' },
					{ fileRowId: '09', fileType: 'video/mp4', hexSignature: '7070AABB667479701234' },
					{ fileRowId: '10', fileType: 'video/quicktime', hexSignature: '0000001466747970FF' },
					{ fileRowId: '11', fileType: 'image/png', hexSignature: '89504E471234' },
					{ fileRowId: '12', fileType: 'image/tiff', hexSignature: '4D4D002A0471234' },
					{ fileRowId: '13', fileType: 'image/tiff', hexSignature: '49492A004171234' },
					{ fileRowId: '14', fileType: 'text/html', hexSignature: '0A3C212D2D207361' }
				]
			};
			await postValidateFileSignatures(request, response);
			expect(response.send).toHaveBeenCalledWith({
				invalidSignatures: []
			});
		});

		it('should send invalid signatures', async () => {
			request = {
				body: [
					{ fileRowId: '01', fileType: 'application/pdf', hexSignature: '2544462DGF' },
					{ fileRowId: '02', fileType: 'application/msword', hexSignature: 'D0CFE0ADEA' },
					{
						fileRowId: '03',
						fileType: 'application/vnd.ms-powerpoint',
						hexSignature: 'D0CF1000'
					},
					{ fileRowId: '04', fileType: 'video/mpeg', hexSignature: '0000B300' },
					{ fileRowId: '05', fileType: 'video/mpeg', hexSignature: '000001CC' },
					{ fileRowId: '06', fileType: 'audio/mpeg', hexSignature: 'FF01B300' },
					{ fileRowId: '07', fileType: 'audio/mpeg', hexSignature: '4943BC' },
					{ fileRowId: '08', fileType: 'video/mp4', hexSignature: 'ABCD0134747970' },
					{ fileRowId: '09', fileType: 'video/mp4', hexSignature: '7070AABB6479701234' },
					{ fileRowId: '10', fileType: 'video/quicktime', hexSignature: '00000466747970FF' },
					{ fileRowId: '11', fileType: 'image/png', hexSignature: '89504E1234' },
					{ fileRowId: '12', fileType: 'image/tiff', hexSignature: '4D4D002471234' },
					{ fileRowId: '13', fileType: 'image/tiff', hexSignature: '4949004171234' },
					{ fileRowId: '14', fileType: 'text/html', hexSignature: '0A3C212D207361' }
				]
			};
			await postValidateFileSignatures(request, response);
			expect(response.send).toHaveBeenCalledWith({
				invalidSignatures: [
					'01',
					'02',
					'03',
					'04',
					'05',
					'06',
					'07',
					'08',
					'09',
					'10',
					'11',
					'12',
					'13',
					'14'
				]
			});
		});
	});
});
