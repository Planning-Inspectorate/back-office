const { getAppealAlreadyReviewed } = require('./appeal-already-reviewed');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/appeal-already-reviewed', () => {
  let req;
  let res;
  let expectedViewData;

  beforeEach(() => {
    req = {
      ...mockReq,
      ...{
        session: {
          casework: {
            reviewer: {
              name: 'Sally Smith',
            },
            reviewOutcome: '',
          },
        },
      },
    };
    res = mockRes();
    expectedViewData = {
      ...{
        pageTitle: 'Appeal already reviewed',
        reviewerName: 'Sally Smith',
      },
    };
  });

  describe('getAppealAlreadyReviewed', () => {
    it('should render the view with data correctly when reviewOutcome is `valid`', () => {
      req.session.casework.reviewOutcome = 1;
      expectedViewData.statusMessage = 'this appeal is valid';

      getAppealAlreadyReviewed(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appealAlreadyReviewed, expectedViewData);
      expect(res.redirect).not.toBeCalled();
    });

    it('should render the view with data correctly when reviewOutcome is `invalid`', () => {
      req.session.casework.reviewOutcome = 2;
      expectedViewData.statusMessage = 'this appeal is invalid';

      getAppealAlreadyReviewed(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appealAlreadyReviewed, expectedViewData);
      expect(res.redirect).not.toBeCalled();
    });

    it('should render the view with data correctly when reviewOutcome is `incomplete`', () => {
      req.session.casework.reviewOutcome = 3;
      expectedViewData.statusMessage = 'that something is missing or wrong';

      getAppealAlreadyReviewed(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appealAlreadyReviewed, expectedViewData);
      expect(res.redirect).not.toBeCalled();
    });

    it('should redirect to the appeals list when the reviewer name is not set', () => {
      delete req.session.casework.reviewer;

      getAppealAlreadyReviewed(req, res);

      expect(res.render).not.toBeCalled();
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${views.appealsList}`);
    });

    it('should redirect to the appeals list when the status message is not set', () => {
      delete req.session.casework.reviewOutcome;

      getAppealAlreadyReviewed(req, res);

      expect(res.render).not.toBeCalled();
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${views.appealsList}`);
    });
  });
});
