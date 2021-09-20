module.exports.APPEAL_DOCUMENT = {
  empty: {
    lpaCode: null,
    decisionDate: null,
    submissionDate: null,
    state: 'DRAFT',
    eligibility: {
      enforcementNotice: null,
      isClaimingCosts: null,
    },
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: null,
        name: null,
        email: null,
        appealingOnBehalfOf: '',
      },
    },
    requiredDocumentsSection: {
      applicationNumber: '',
      originalApplication: {
        uploadedFile: {
          name: '',
          id: null,
        },
      },
      decisionLetter: {
        uploadedFile: {
          name: '',
          id: null,
        },
      },
    },
    yourAppealSection: {
      appealStatement: {
        uploadedFile: {
          name: '',
          id: null,
        },
        hasSensitiveInformation: null,
      },
      otherDocuments: {
        uploadedFiles: [],
      },
    },
    appealSiteSection: {
      siteAddress: {
        addressLine1: null,
        addressLine2: null,
        town: null,
        county: null,
        postcode: null,
      },
      siteOwnership: {
        ownsWholeSite: null,
        haveOtherOwnersBeenTold: null,
      },
      siteAccess: {
        canInspectorSeeWholeSiteFromPublicRoad: null,
        howIsSiteAccessRestricted: null,
      },
      healthAndSafety: {
        hasIssues: null,
        healthAndSafetyIssues: null,
      },
    },
    appealSubmission: {
      appealPDFStatement: {
        uploadedFile: {
          name: '',
          id: null,
        },
      },
    },
    sectionStates: {
      aboutYouSection: {
        yourDetails: 'NOT STARTED',
      },
      requiredDocumentsSection: {
        applicationNumber: 'NOT STARTED',
        originalApplication: 'NOT STARTED',
        decisionLetter: 'NOT STARTED',
      },
      yourAppealSection: {
        appealStatement: 'NOT STARTED',
        otherDocuments: 'NOT STARTED',
      },
      appealSiteSection: {
        siteAddress: 'NOT STARTED',
        siteAccess: 'NOT STARTED',
        siteOwnership: 'NOT STARTED',
        healthAndSafety: 'NOT STARTED',
      },
    },
  },
};
