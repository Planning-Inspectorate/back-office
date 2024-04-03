// @ts-nocheck
import { jest } from '@jest/globals';
import { viewGeneralSection51page } from '../applications-general-s51.controller.js';
import { getGeneralSection51URL } from '../utils/get-general-section-51-URL.js';
import { getGeneralSection51Data } from '../utils/get-general-section-51-data.js';

jest.mock('../utils/get-general-section-51-data.js', () => ({
  ...jest.requireActual('../utils/get-general-section-51-data.js'),
  getGeneralSection51Data: jest.fn(),
}));

jest.mock('../utils/get-general-section-51-URL.js', () => ({
  ...jest.requireActual('../utils/get-general-section-51-URL.js'),
  getGeneralSection51URL: jest.fn(),
}));

describe('General section 51 page', () => {
  describe('#viewGeneralSection51page', () => {
    it('should redirect to general section 51 folder page', async () => {
      const req = {};
      const res = {
        redirect: jest.fn()
      };
      getGeneralSection51Data.mockResolvedValue({ caseId: 'mockCaseId', folderId: 'mockFolderId' });
      getGeneralSection51URL.mockResolvedValue('/applications-service/case/mockCaseId/project-documentation/mockFolderId/s51-advice');

      await viewGeneralSection51page(req, res);


      expect(res.redirect).toHaveBeenCalledWith('/applications-service/case/mockCaseId/project-documentation/mockFolderId/s51-advice');

    });
  });
});