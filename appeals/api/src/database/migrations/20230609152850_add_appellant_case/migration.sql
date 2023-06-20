/*
  Warnings:

  - You are about to drop the `AppealDetailsFromAppellant` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[AppealDetailsFromAppellant] DROP CONSTRAINT [AppealDetailsFromAppellant_appealId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Appellant] ADD [company] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[AppealDetailsFromAppellant];

-- CreateTable
CREATE TABLE [dbo].[AppellantCase] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [knowledgeOfOtherLandownersId] INT,
    [planningObligationStatusId] INT,
    [applicantFirstName] NVARCHAR(1000),
    [applicantSurname] NVARCHAR(1000),
    [areAllOwnersKnown] BIT,
    [hasAdvertisedAppeal] BIT,
    [hasAttemptedToIdentifyOwners] BIT,
    [hasDesignAndAccessStatement] BIT,
    [hasHealthAndSafetyIssues] BIT,
    [hasNewPlansOrDrawings] BIT,
    [hasNewSupportingDocuments] BIT,
    [hasOtherTenants] BIT,
    [hasPlanningObligation] BIT,
    [hasSeparateOwnershipCertificate] BIT,
    [hasSubmittedDesignAndAccessStatement] BIT,
    [hasToldOwners] BIT,
    [hasToldTenants] BIT,
    [healthAndSafetyIssues] NVARCHAR(1000),
    [isAgriculturalHolding] BIT,
    [isAgriculturalHoldingTenant] BIT,
    [isAppellantNamedOnApplication] BIT,
    [isDevelopmentDescriptionStillCorrect] BIT,
    [isSiteFullyOwned] BIT,
    [isSitePartiallyOwned] BIT,
    [isSiteVisibleFromPublicRoad] BIT,
    [newDevelopmentDescription] NVARCHAR(1000),
    [visibilityRestrictions] NVARCHAR(1000),
    CONSTRAINT [AppellantCase_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCase_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[PlanningObligationStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PlanningObligationStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PlanningObligationStatus_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[KnowledgeOfOtherLandowners] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [KnowledgeOfOtherLandowners_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [KnowledgeOfOtherLandowners_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_knowledgeOfOtherLandownersId_fkey] FOREIGN KEY ([knowledgeOfOtherLandownersId]) REFERENCES [dbo].[KnowledgeOfOtherLandowners]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_planningObligationStatusId_fkey] FOREIGN KEY ([planningObligationStatusId]) REFERENCES [dbo].[PlanningObligationStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
