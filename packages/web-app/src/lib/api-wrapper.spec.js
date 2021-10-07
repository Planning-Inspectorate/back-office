const { getData, saveData } = require('./api-wrapper');

describe('lib/apiWrapper', () => {
  describe('getData', () => {
    it('should return the correct data when given an application id', () => {
      const result = getData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: {
          id: '6e409024-97f3-4178-a44d-f0f3f234035c',
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
                id: 'add0eb92-0e87-4b4e-8980-cec387967d4c',
              },
            },
            decisionLetter: {
              uploadedFile: {
                name: 'decision letter.pdf',
                id: '06f3d256-cb09-4146-aa4d-25fea4719062',
              },
            },
          },
          yourAppealSection: {
            appealStatement: {
              uploadedFile: {
                name: 'appeal statement.pdf',
                id: 'add0eb92-0e87-4b4e-8980-cec387967d4c',
              },
            },
            otherDocuments: {
              uploadedFiles: [
                {
                  name: 'other documents 1.pdf',
                  id: '06f3d256-cb09-4146-aa4d-25fea4719062',
                },
                {
                  name: 'other documents 2.pdf',
                  id: 'add0eb92-0e87-4b4e-8980-cec387967d4c',
                },
                {
                  name: 'other documents 3.pdf',
                  id: '06f3d256-cb09-4146-aa4d-25fea4719062',
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
          state: 'Appeal Received',
        },
        casework: {},
      });
    });

    it('should return an empty appeal and a default casework object when not given an application id', () => {
      const result = getData();

      expect(result).toEqual({
        appeal: {},
        casework: {},
      });
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
