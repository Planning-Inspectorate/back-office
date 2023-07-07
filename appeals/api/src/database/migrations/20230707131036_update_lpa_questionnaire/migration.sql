BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] ADD [isAffectingNeighbouringSites] BIT;

-- CreateTable
CREATE TABLE [dbo].[NeighbouringSiteContact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressId] INT,
    [lpaQuestionnaireId] INT,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000),
    [telephone] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [NeighbouringSiteContact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSiteContact] ADD CONSTRAINT [NeighbouringSiteContact_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSiteContact] ADD CONSTRAINT [NeighbouringSiteContact_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
