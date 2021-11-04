const documentTypes = {
  originalApplication: {
    name: 'originalApplication',
    multiple: false,
  },
  decisionLetter: {
    name: 'decisionLetter',
    multiple: false,
  },
  appealStatement: {
    name: 'appealStatement',
    multiple: false,
  },
  otherDocuments: {
    name: 'otherDocuments',
    multiple: true,
  },
  appealPdf: {
    name: 'appealPdf',
    multiple: false,
  },
  decisionPlans: {
    name: 'decisionPlans',
    multiple: true,
  },
  officersReport: {
    name: 'officersReport',
    multiple: true,
  },
  interestedParties: {
    name: 'interestedParties',
    multiple: true,
  },
  representations: {
    name: 'representations',
    multiple: true,
  },
  notifyingParties: {
    name: 'notifyingParties',
    multiple: true,
  },
  siteNotices: {
    name: 'siteNotices',
    multiple: true,
  },
  conservationAreaMap: {
    name: 'conservationAreaMap',
    multiple: true,
  },
  planningHistory: {
    name: 'planningHistory',
    multiple: true,
  },
  otherPolicies: {
    name: 'otherPolicies',
    multiple: true,
  },
  statutoryDevelopment: {
    name: 'statutoryDevelopment',
    multiple: true,
  },
  supplementaryDocuments: {
    name: 'supplementaryDocuments',
    multiple: true,
  },
  questionnairePdf: {
    name: 'questionnairePdf',
    multiple: false,
  },
};

module.exports = documentTypes;
