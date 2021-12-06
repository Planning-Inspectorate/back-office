const { getSiteAddress, postSiteAddress } = require('./site-address');
const views = require('../../config/views');
const saveAndContinue = require('../../lib/save-and-continue');
const { mockReq, mockRes } = require('../../../test/utils/mocks');
const { saveAppealLinkData } = require('../../lib/api-wrapper');
const { appealDetails } = require('../../config/views');

jest.mock('../../lib/save-and-continue');
jest.mock('../../lib/api-wrapper');

describe('controllers/appeal-details/site-address', () => {
  let req;
  let res;

  const appealId = 'ff5fe7af-e69c-4c0e-9d78-70890b2a6e31';
  const siteAddressLineOne = 'line 1';
  const siteAddressLineTwo = 'line 2';
  const siteAddressTown = 'town';
  const siteAddressCounty = 'county';

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getSiteAddress', () => {
    const siteAddressPostCode = 'TE8 6UK';

    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            siteAddressLineOne,
            siteAddressLineTwo,
            siteAddressTown,
            siteAddressCounty,
            siteAddressPostCode,
          },
        },
      };

      getSiteAddress(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.siteAddress, {
        siteAddressLineOne,
        siteAddressLineTwo,
        siteAddressTown,
        siteAddressCounty,
        siteAddressPostCode,
      });
    });
  });

  describe('postSiteAddress', () => {
    const siteAddressPostcode = 'TE8 6UK';

    it('should call save methods with the correct data', async () => {
      req = {
        body: {
          'site-address-line-one': siteAddressLineOne,
          'site-address-line-two': siteAddressLineTwo,
          'site-town-city': siteAddressTown,
          'site-county': siteAddressCounty,
          'site-postcode': siteAddressPostcode,
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      await postSiteAddress(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.siteAddress,
        nextPage: `${appealDetails}/${appealId}`,
        viewData: {
          siteAddressLineOne,
          siteAddressLineTwo,
          siteAddressTown,
          siteAddressCounty,
          siteAddressPostcode,
        },
        saveData: saveAppealLinkData,
      });
    });
  });
});
