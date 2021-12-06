const documentTypes = {
  originalApplication: {
    name: 'originalApplication',
    multiple: false,
    displayName: 'Planning application form',
  },
  decisionLetter: {
    name: 'decisionLetter',
    multiple: false,
    displayName: 'Decision notice',
  },
  appealStatement: {
    name: 'appealStatement',
    multiple: false,
    displayName: 'Appeal Statement',
  },
  otherDocuments: {
    name: 'otherDocuments',
    multiple: true,
    displayName: 'Supporting Documents',
  },
  appealPdf: {
    name: 'appealPdf',
    multiple: false,
    displayName: '',
  },
  decisionPlans: {
    name: 'decisionPlans',
    multiple: true,
    displayName: 'Plans used to reach decision',
  },
  officersReport: {
    name: 'officersReport',
    multiple: true,
    displayName: 'Planning Officers report',
  },
  interestedParties: {
    name: 'interestedParties',
    multiple: true,
    displayName: 'Application publicity',
  },
  representations: {
    name: 'representations',
    multiple: true,
    displayName: 'Representations',
  },
  notifyingParties: {
    name: 'notifyingParties',
    multiple: true,
    displayName: 'Application notification',
  },
  siteNotices: {
    name: 'siteNotices',
    multiple: true,
    displayName: '',
  },
  conservationAreaMap: {
    name: 'conservationAreaMap',
    multiple: true,
    displayName: '',
  },
  planningHistory: {
    name: 'planningHistory',
    multiple: true,
    displayName: 'Details of planning history',
  },
  otherPolicies: {
    name: 'otherPolicies',
    multiple: true,
    displayName: 'Other relevant polices',
  },
  statutoryDevelopment: {
    name: 'statutoryDevelopment',
    multiple: true,
    displayName: 'Statutory development plan policy',
  },
  supplementaryDocuments: {
    name: 'supplementaryDocuments',
    multiple: true,
    displayName: 'Supplementary Planning Documents',
  },
  questionnairePdf: {
    name: 'questionnairePdf',
    multiple: false,
    displayName: '',
  },
};

module.exports = documentTypes;
