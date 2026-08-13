BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] ADD [useOfAI] NVARCHAR(20) CONSTRAINT [Representation_useOfAI_df] DEFAULT 'UNKNOWN';

-- retroactively fill existing representations
-- Note: Wrapped in EXEC() because SQL Server will throw an "Invalid column name" error 
-- if it tries to compile an UPDATE statement referencing a column that was added 
-- via ALTER TABLE in the very same batch.
EXEC('UPDATE [dbo].[Representation] SET [useOfAI] = ''UNKNOWN'' WHERE [useOfAI] IS NULL;');

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
