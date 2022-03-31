BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [siteNearConservationArea] BIT,
    [affectsListedBuilding] BIT,
    [listedBuildingDescription] NVARCHAR(1000),
    [extraConditions] BIT,
    [inGreenBelt] BIT,
    [inOrNearConservationArea] BIT,
    [siteVisibleFromPublicLand] BIT,
    [sideVisibleFromPublicLandDescription] NVARCHAR(1000),
    [doesInspectorNeedToEnterSite] BIT,
    [doesInspectorNeedToEnterSideDescription] NVARCHAR(1000),
    [doesInspectorNeedToAccessNeighboursLand] BIT,
    [doesInspectorNeedToAccessNeighboursLandDescription] NVARCHAR(1000),
    [healthAndSafetyIssues] BIT,
    [healthAndSafetyIsueesDescription] NVARCHAR(1000),
    [appealsInImmediateAreaBeingConsidered] NVARCHAR(1000),
    CONSTRAINT [LPAQuestionnaire_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [LPAQuestionnaire_appealId_key] UNIQUE ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
