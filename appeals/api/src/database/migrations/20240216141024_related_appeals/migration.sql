BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealRelationship] ADD [externaAppealType] NVARCHAR(1000),
[externalSource] BIT,
[type] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealRelationship_type_df] DEFAULT 'linked';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
