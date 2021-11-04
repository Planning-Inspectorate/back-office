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
          state: 'Appeal Received',
        },
        questionnaire: {
          appealId: '89aa8504-773c-42be-bb68-029716ad9756',
          horizonId: 'fake-horizon-id',
          state: 'COMPLETED',
          aboutAppealSection: {
            submissionAccuracy: {
              accurateSubmission: false,
              inaccuracyReason:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
            },
            extraConditions: {
              hasExtraConditions: true,
              extraConditions:
                'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.\n\nSed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.',
            },
            otherAppeals: {
              adjacentAppeals: true,
              appealReferenceNumbers: 'abc-123, def-456',
            },
          },
          siteSeenPublicLand: true,
          enterAppealSite: {
            mustEnter: true,
            enterReasons:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. enterAppealSite.',
          },
          accessNeighboursLand: {
            needsAccess: true,
            addressAndReason:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. accessNeighboursLand.',
          },
          healthSafety: {
            hasHealthSafety: true,
            healthSafetyIssues:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. accessNeighboursLand.',
          },
          listedBuilding: {
            affectSetting: true,
            buildingDetails:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. listedBuilding.',
          },
          greenBelt: true,
          originalPlanningApplicationPublicised: true,
          nearConservationArea: true,
          requiredDocumentsSection: {
            plansDecision: {
              uploadedFiles: [
                {
                  name: 'plans-decision-uploaded-file.pdf',
                  id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
                },
              ],
            },
            officersReport: {
              uploadedFiles: [
                {
                  name: 'officers-report-uploaded-file.pdf',
                  id: 'c89ba175-82cc-404f-bdbb-450c4659df30',
                },
              ],
            },
          },
          optionalDocumentsSection: {
            interestedPartiesApplication: {
              uploadedFiles: [
                {
                  name: 'application-notification-uploaded-file.pdf',
                  id: '99ee0123-ac21-7618-b00a-12dfdde8d9a5',
                },
              ],
            },
            representationsInterestedParties: {
              uploadedFiles: [
                {
                  name: 'representations-uploaded-file.pdf',
                  id: 'a6be9fa8-de03-43d2-a13b-0a18661fd498',
                },
                {
                  name: 'representations-uploaded-file-2.pdf',
                  id: 'cd5451be-275e-11ec-9621-0242ac130002',
                },
              ],
            },
            interestedPartiesAppeal: {
              uploadedFiles: [
                {
                  name: 'upload-file-valid.pdf',
                  id: '4583adcb-6400-462f-9407-abe18f3a7737',
                },
              ],
            },
            siteNotices: {
              uploadedFiles: [
                {
                  name: 'application-publicity-uploaded-file.pdf',
                  id: '5ff87234-a009-bb12-5765-788992f2f3ac',
                },
              ],
            },
            conservationAreaMap: {
              uploadedFiles: [
                {
                  name: 'conservation-area-map-uploaded-file.pdf',
                  id: '11dbbb23-9677-a890-aa33-f887b8b1e209',
                },
              ],
            },
            planningHistory: {
              uploadedFiles: [
                {
                  name: 'upload-file-valid.pdf',
                  id: 'e04e2cc0-de29-4a78-9941-67bab0c9251b',
                },
              ],
            },
            statutoryDevelopment: {
              uploadedFiles: [
                {
                  name: 'statutory-development-uploaded-file.pdf',
                  id: '4a754d67-9c12-5556-ae71-28af8f710ea4',
                },
                {
                  name: 'statutory-development-uploaded-file-2.pdf',
                  id: '27be942a-26b5-11ec-9621-0242ac130002',
                },
              ],
            },
            otherPolicies: {
              uploadedFiles: [
                {
                  name: 'other-policy-uploaded-file.pdf',
                  id: '837cb5a1-ff87-fd90-3526-657b44b3a561',
                },
              ],
            },
            supplementaryPlanningDocuments: {
              uploadedFiles: [
                {
                  name: 'supplementary-planning-uploaded-file.pdf',
                  id: '20363838-c8da-4cfd-ab7d-e18a12fe3148',
                  documentName: 'Mock Document Name',
                  formallyAdopted: true,
                  adoptedDate: '06-12-2021',
                  stageReached: '',
                },
              ],
            },
            developmentOrNeighbourhood: {
              hasPlanSubmitted: true,
              planChanges: 'mock plan changes',
            },
          },
          sectionStates: {
            aboutAppealSection: {
              submissionAccuracy: 'COMPLETED',
              extraConditions: 'COMPLETED',
              otherAppeals: 'COMPLETED',
            },
            aboutAppealSiteSection: {
              aboutSite: 'COMPLETED',
            },
            requiredDocumentsSection: {
              plansDecision: 'COMPLETED',
              officersReport: 'COMPLETED',
            },
            optionalDocumentsSection: {
              interestedPartiesApplication: 'COMPLETED',
              representationsInterestedParties: 'COMPLETED',
              interestedPartiesAppeal: 'COMPLETED',
              conservationAreaMap: 'COMPLETED',
              siteNotices: 'COMPLETED',
              planningHistory: 'COMPLETED',
              statutoryDevelopment: 'COMPLETED',
              otherPolicies: 'COMPLETED',
              supplementaryPlanningDocuments: 'COMPLETED',
              developmentOrNeighbourhood: 'COMPLETED',
            },
          },
          submission: {
            pdfStatement: {
              uploadedFile: null,
            },
          },
        },
        casework: {},
      });
    });

    it('should return an empty appeal and a default casework object when not given an application id', () => {
      const result = getData();

      expect(result).toEqual({
        appeal: {},
        casework: {},
        questionnaire: {},
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
