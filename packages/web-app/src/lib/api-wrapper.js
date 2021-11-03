// Uncomment to test the /appeal-already-reviewed page
// const casework = {
//   reviewer: {
//     name: 'Sally Smith',
//   },
//   reviewOutcome: 'valid',
// };

const getData = (appealId) => {
  if (appealId) {
    return {
      appeal: {
        id: appealId,
        horizonId: 'APP/Q9999/D/21/1234567',
        lpaCode: 'Maidstone Borough Council',
        submissionDate: new Date('2021-05-16T12:00:00.000Z'),
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
        // Switch state to test the /appeal-already-reviewed page
        state: 'Appeal Received',
        // state: 'Appeal Complete',
      },
      // Switch casework to test the /appeal-already-reviewed page
      casework: {},
      // casework,
    };
  }

  return {
    appeal: {},
    // Switch casework to test the /appeal-already-reviewed page
    casework: {},
    // casework,
  };
};

const saveData = (data) => {
  if (data) {
    return data;
  }

  return null;
};

module.exports = {
  getData,
  saveData,
};
