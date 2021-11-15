const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE CreateHASAppealSubmission
        @json NVARCHAR(4000)
      AS
      DECLARE
        @appealId CHAR(36),
        @creatorEmailAddress NVARCHAR(255),
        @creatorName NVARCHAR(80),
        @creatorOriginalApplicant BIT,
        @creatorOnBehalfOf NVARCHAR(80),
        @originalApplicationNumber NVARCHAR(30),
        @siteOwnership BIT,
        @siteInformOwners BIT,
        @siteRestriction BIT,
        @siteRestrictionDetails NVARCHAR(255),
        @safetyConcern BIT,
        @safetyConcernDetails NVARCHAR(255),
        @sensitiveInformation BIT,
        @termsAgreed BIT,
        @decisionDate DATE,
        @submissionDate DATE,
        @eventUserId CHAR(36),
        @eventUserName NVARCHAR(256)
      BEGIN
        SET @appealId = JSON_VALUE(@json, '$.appealId')

        SELECT
          @creatorEmailAddress = CreatorEmailAddress,
          @creatorName = CreatorName,
          @creatorOriginalApplicant = CreatorOriginalApplicant,
          @creatorOnBehalfOf = CreatorOnBehalfOf,
          @originalApplicationNumber = OriginalApplicationNumber,
          @siteOwnership = SiteOwnership,
          @siteInformOwners = SiteInformOwners,
          @siteRestriction = SiteRestriction,
          @siteRestrictionDetails = SiteRestrictionDetails,
          @safetyConcern = SafetyConcern,
          @safetyConcernDetails = SafetyConcernDetails,
          @sensitiveInformation = SensitiveInformation,
          @termsAgreed = TermsAgreed,
          @decisionDate = DecisionDate,
          @submissionDate = SubmissionDate,
          @eventUserId = EventUserID,
          @eventUserName = EventUserName
        FROM HASAppealSubmission (NOLOCK)
        WHERE AppealID = @appealId AND LatestEvent = 1;

        IF JSON_VALUE(@json, '$.creatorEmailAddress') IS NOT NULL
          SET @creatorEmailAddress = JSON_VALUE(@json, '$.creatorEmailAddress')

        IF JSON_VALUE(@json, '$.creatorName') IS NOT NULL
          SET @creatorName = JSON_VALUE(@json, '$.creatorName')

        IF JSON_VALUE(@json, '$.creatorOriginalApplicant') IS NOT NULL
          SET @creatorOriginalApplicant = JSON_VALUE(@json, '$.creatorOriginalApplicant')

        IF JSON_VALUE(@json, '$.creatorOnBehalfOf') IS NOT NULL
          SET @creatorOnBehalfOf = JSON_VALUE(@json, '$.creatorOnBehalfOf')

        IF JSON_VALUE(@json, '$.originalApplicationNumber') IS NOT NULL
          SET @originalApplicationNumber = JSON_VALUE(@json, '$.originalApplicationNumber')

        IF JSON_VALUE(@json, '$.siteOwnership') IS NOT NULL
          SET @siteOwnership = JSON_VALUE(@json, '$.siteOwnership')

        IF JSON_VALUE(@json, '$.siteInformOwners') IS NOT NULL
          SET @siteInformOwners = JSON_VALUE(@json, '$.siteInformOwners')

        IF JSON_VALUE(@json, '$.siteRestriction') IS NOT NULL
          SET @siteRestriction = JSON_VALUE(@json, '$.siteRestriction')

        IF JSON_VALUE(@json, '$.siteRestrictionDetails') IS NOT NULL
          SET @siteRestrictionDetails = JSON_VALUE(@json, '$.siteRestrictionDetails')

        IF JSON_VALUE(@json, '$.safetyConcern') IS NOT NULL
          SET @safetyConcern = JSON_VALUE(@json, '$.safetyConcern')

        IF JSON_VALUE(@json, '$.safetyConcernDetails') IS NOT NULL
          SET @safetyConcernDetails = JSON_VALUE(@json, '$.safetyConcernDetails')

        IF JSON_VALUE(@json, '$.sensitiveInformation') IS NOT NULL
          SET @sensitiveInformation = JSON_VALUE(@json, '$.sensitiveInformation')

        IF JSON_VALUE(@json, '$.termsAgreed') IS NOT NULL
          SET @termsAgreed = JSON_VALUE(@json, '$.termsAgreed')

        IF JSON_VALUE(@json, '$.decisionDate') IS NOT NULL
          SET @decisionDate = JSON_VALUE(@json, '$.decisionDate')

        IF JSON_VALUE(@json, '$.submissionDate') IS NOT NULL
          SET @submissionDate = JSON_VALUE(@json, '$.submissionDate')

        IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
          SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

        IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
          SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

        INSERT INTO HASAppealSubmission (
          ID,
          AppealID,
          CreatorEmailAddress,
          CreatorName,
          CreatorOriginalApplicant,
          CreatorOnBehalfOf,
          OriginalApplicationNumber,
          SiteOwnership,
          SiteInformOwners,
          SiteRestriction,
          SiteRestrictionDetails,
          SafetyConcern,
          SafetyConcernDetails,
          SensitiveInformation,
          TermsAgreed,
          DecisionDate,
          SubmissionDate,
          EventUserID,
          EventUserName
        )
        VALUES (
          newid(),
          @appealId,
          @creatorEmailAddress,
          @creatorName,
          @creatorOriginalApplicant,
          @creatorOnBehalfOf,
          @originalApplicationNumber,
          @siteOwnership,
          @siteInformOwners,
          @siteRestriction,
          @siteRestrictionDetails,
          @safetyConcern,
          @safetyConcernDetails,
          @sensitiveInformation,
          @termsAgreed,
          @decisionDate,
          @submissionDate,
          @eventUserId,
          @eventUserName
        );
      END
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppealSubmission');
  },
};

module.exports = migration;
