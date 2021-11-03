const getAddress = (siteAddress) =>
  [
    siteAddress?.addressLine1,
    siteAddress?.addressLine2,
    siteAddress?.town,
    siteAddress?.county,
    siteAddress?.postcode,
  ].filter((n) => n);

module.exports = {
  getAddressSingleLine: (siteAddress) => getAddress(siteAddress).join(', '),
  getAddressMultiLine: (siteAddress) => getAddress(siteAddress).join('\n'),
};
