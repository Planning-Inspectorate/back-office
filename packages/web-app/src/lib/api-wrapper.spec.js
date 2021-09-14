const { getData, saveData } = require('./api-wrapper');

describe('lib/apiWrapper', () => {
  describe('getData', () => {
    it('should return the correct data when given an application id', () => {
      const result = getData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: {
          id: '1dc8a211-4e1b-44fc-9e9c-a6e7b802fb8a',
          horizonId: 'APP/Q9999/D/21/1234567',
          lpaCode: 'Maidstone Borough Council',
          submissionDate: '2021-05-16T12:00:00.000Z',
          aboutYouSection: {
            yourDetails: {
              isOriginalApplicant: true,
              name: 'Manish Sharma',
              appealingOnBehalfOf: 'Jack Pearson',
            },
          },
          requiredDocumentsSection: {
            applicationNumber: '48269/APP/2020/1482',
            originalApplication: {
              uploadedFile: {
                name: 'planning application.pdf',
              },
            },
            decisionLetter: {
              uploadedFile: {
                name: 'decision letter.pdf',
              },
            },
          },
          yourAppealSection: {
            appealStatement: {
              uploadedFile: {
                name: 'appeal statement.pdf',
              },
            },
            otherDocuments: {
              uploadedFiles: [
                {
                  name: 'other documents 1.pdf',
                },
                {
                  name: 'other documents 2.pdf',
                },
                {
                  name: 'other documents 3.pdf',
                },
              ],
            },
          },
          appealSiteSection: {
            siteAddress: {
              addressLine1: '96 The Avenue',
              addressLine2: '',
              town: 'Maidstone',
              county: '',
              postcode: 'XM26 7YS',
            },
          },
        },
        casework: {},
      });
    });

    it('should return null when not given an application id', () => {
      const result = getData();

      expect(result).toBeNull();
    });
  });

  describe('saveData', () => {
    it('should return the data when given data', () => {
      const data = {
        appeal: {
          horizonId: 'APP/Q9999/D/21/1234567',
        },
      };

      const result = saveData(data);

      expect(result).toEqual(data);
    });

    it('should return null when not given data', () => {
      const result = saveData();

      expect(result).toBeNull();
    });
  });
});
