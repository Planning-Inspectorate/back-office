const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/db-wrapper');

const hasAppealSubmission = sequelize().define('HASAppealSubmission', {
  ID: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  AppealID: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  CreatorEmailAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  CreatorName: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  CreatorOriginalApplicant: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  CreatorOnBehalfOf: {
    type: DataTypes.STRING(80),
  },
  OriginalApplicationNumber: {
    type: DataTypes.STRING(30),
  },
  SiteOwnership: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  SiteInformOwners: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  SiteRestriction: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  SiteRestrictionsDetails: {
    type: DataTypes.STRING(255),
  },
  SafetyConcern: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  SafetyConcernDetails: {
    type: DataTypes.STRING(255),
  },
  SensitiveInformation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  TermsAgreed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  DecisionDate: {
    type: DataTypes.DATE,
  },
  SubmissionDate: {
    type: DataTypes.DATE,
  },
  LatestEvent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  EventDateTime: {
    type: DataTypes.DATE,
  },
  EventUserID: {
    type: DataTypes.UUID,
  },
  EventUserName: {
    type: DataTypes.STRING(256),
  },
  CheckSumRow: {
    type: DataTypes.INTEGER,
  },
});

module.exports = hasAppealSubmission;
