const { getAddressSingleLine, getAddressMultiLine } = require('./get-address');

const siteAddressLineOne = 'address line 1';
const siteAddressLineTwo = 'address line 2';
const siteAddressTown = 'fake town';
const siteAddressCounty = 'fake county';
const siteAddressPostCode = 'FA1 9KE';

const addressFull = {
  siteAddressLineOne,
  siteAddressLineTwo,
  siteAddressTown,
  siteAddressCounty,
  siteAddressPostCode,
};

describe('lib/get-address', () => {
  describe('getAddressSingleLine', () => {
    [
      {
        description: 'full address',
        given: () => addressFull,
        expected: Object.values(addressFull).join(', '),
      },
      {
        description: 'nothing given',
        given: () => {},
        expected: '',
      },
      /* eslint-disable no-shadow */
      ...Object.keys(addressFull).map((addressPart) => ({
        description: `missing ${addressPart}`,
        given: () => (({ addressPart, ...rest }) => rest)(addressFull),
        expected: Object.values((({ addressPart, ...rest }) => rest)(addressFull)).join(', '),
      })),
      {
        description: `missing several properties of the address`,
        given: () =>
          (({ siteAddressLineTwo, siteAddressCounty, siteAddressPostCode, ...rest }) => rest)(
            addressFull
          ),
        expected: 'address line 1, fake town',
      },
      /* eslint-enable no-shadow */
    ].forEach(({ description, given, expected }) => {
      it(`should return the correctly formatted address - ${description}`, () => {
        expect(getAddressSingleLine(given())).toEqual(expected);
      });
    });
  });

  describe('getAddressMultiLine', () => {
    [
      {
        description: 'full address',
        given: () => addressFull,
        expected: Object.values(addressFull).join('\n'),
      },
      {
        description: 'nothing given',
        given: () => {},
        expected: '',
      },
      /* eslint-disable no-shadow */
      ...Object.keys(addressFull).map((addressPart) => ({
        description: `missing ${addressPart}`,
        given: () => (({ addressPart, ...rest }) => rest)(addressFull),
        expected: Object.values((({ addressPart, ...rest }) => rest)(addressFull)).join('\n'),
      })),
      {
        description: `missing several properties of the address`,
        given: () =>
          (({ siteAddressLineTwo, siteAddressCounty, siteAddressPostCode, ...rest }) => rest)(
            addressFull
          ),
        expected: 'address line 1\nfake town',
      },
      /* eslint-enable no-shadow */
    ].forEach(({ description, given, expected }) => {
      it(`should return the correctly formatted address - ${description}`, () => {
        expect(getAddressMultiLine(given())).toEqual(expected);
      });
    });
  });
});
