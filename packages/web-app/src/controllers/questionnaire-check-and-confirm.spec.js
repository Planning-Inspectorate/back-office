/* eslint-disable global-require */
const { getCheckAndConfirm, setCheckAndConfirm } = require('./questionnaire-check-and-confirm');
const { reviewQuestionnaireSubmission: previousPage } = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/questionnaire-check-and-confirm', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getCheckAndConfirm', () => {
    it('should render the view with incomplete outcome correctly', async () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'Incomplete',
          },
        },
        params: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
      };

      const { questionnaire, appeal } = req.session;

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        pageTitle: 'Review questionnaire',
        previousPage: `${previousPage}/${appeal.appealId}`,
        questionnaireData: questionnaire,
        reviewOutcome: 'Incomplete',
      });
    });

    it('should render the view with complete outcome correctly', async () => {
      req = {
        session: {
          appeal: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'Complete',
          },
        },
        params: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
      };

      const { questionnaire, appeal } = req.session;
      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        pageTitle: 'Review questionnaire',
        previousPage: `${previousPage}/${appeal.appealId}`,
        questionnaireData: questionnaire,
        reviewOutcome: 'Complete',
      });
    });
  });

  describe('setCheckAndConfirm', () => {
    it('should set incomplete status for appeal id', async () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'Incomplete',
          },
        },
        params: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
      };

      await setCheckAndConfirm(req, res);

      expect(res.render).toBeCalledWith('review-questionnaire', {
        pageTitle: 'Review questionnaire',
        appealData: req.session.appeal,
        questionnaireData: req.session.questionnaire,
      });
    });

    it('should set complete status for appeal id', async () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'Complete',
          },
        },
        params: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
      };

      await setCheckAndConfirm(req, res);

      expect(res.render).toBeCalledWith('review-questionnaire', {
        pageTitle: 'Review questionnaire',
        appealData: req.session.appeal,
        questionnaireData: req.session.questionnaire,
      });
    });
  });
});
