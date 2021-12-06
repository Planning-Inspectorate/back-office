const { siteAddress: currentPage, appealDetails } = require('../../config/views');
const { saveAppealLinkData } = require('../../lib/api-wrapper');
const saveAndContinue = require('../../lib/save-and-continue');
const { appealLink } = require('../../config/db-fields');

const viewData = (data, errors, errorSummary) => ({
  pageTitle: 'Change address of the appeal site',
  ...data,
  errors,
  errorSummary,
});

exports.getSiteAddress = (req, res) => {
  const {
    session: {
      appeal: {
        siteAddressLineOne,
        siteAddressLineTwo,
        siteAddressTown,
        siteAddressCounty,
        siteAddressPostCode,
      },
    },
  } = req;

  const options = viewData({
    siteAddressLineOne,
    siteAddressLineTwo,
    siteAddressTown,
    siteAddressCounty,
    siteAddressPostCode,
  });

  res.render(currentPage, options);
};

exports.postSiteAddress = async (req, res) => {
  const {
    session: {
      appeal: { appealId },
    },
  } = req;

  const siteAddressLineOne = req.body['site-address-line-one'];
  const siteAddressLineTwo = req.body['site-address-line-two'];
  const siteAddressTown = req.body['site-town-city'];
  const siteAddressCounty = req.body['site-county'];
  const siteAddressPostcode = req.body['site-postcode'];

  req.session.casework = {
    [appealLink.siteAddressLineOne]: siteAddressLineOne,
    [appealLink.siteAddressLineTwo]: siteAddressLineTwo,
    [appealLink.siteAddressTown]: siteAddressTown,
    [appealLink.siteAddressCounty]: siteAddressCounty,
    [appealLink.siteAddressPostcode]: siteAddressPostcode,
  };

  saveAndContinue({
    req,
    res,
    currentPage,
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
};
