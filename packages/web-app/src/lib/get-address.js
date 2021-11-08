const getAddress = (appeal) =>
  [
    appeal?.siteAddressLineOne,
    appeal?.siteAddressLineTwo,
    appeal?.siteAddressTown,
    appeal?.siteAddressCounty,
    appeal?.siteAddressPostCode,
  ].filter((n) => n);

module.exports = {
  getAddressSingleLine: (appeal) => getAddress(appeal).join(', '),
  getAddressMultiLine: (appeal) => getAddress(appeal).join('\n'),
};
