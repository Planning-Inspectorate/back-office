const { DataTypes } = require('sequelize');
const hasAppealSubmission = require('./has-appeal-submission');

describe('models/has-appeal-submission', () => {
  it('should define the correct name and properties', () => {
    const sequelize = {
      define: (name, properties) => ({ name, properties }),
    };
    const model = hasAppealSubmission(sequelize, DataTypes);

    expect(model.name).toEqual('HASAppealSubmission');
    expect(model.properties).toEqual({
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
      SiteRestrictionDetails: {
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
      }
    });
  });
});
