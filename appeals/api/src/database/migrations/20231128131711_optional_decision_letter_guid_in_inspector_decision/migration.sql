BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[InspectorDecision] DROP CONSTRAINT [InspectorDecision_decisionLetterGuid_fkey];

-- DropIndex
ALTER TABLE [dbo].[InspectorDecision] DROP CONSTRAINT [InspectorDecision_decisionLetterGuid_key];

-- AlterTable
ALTER TABLE [dbo].[InspectorDecision] ALTER COLUMN [decisionLetterGuid] NVARCHAR(1000) NULL;

-- ensuring that non-null values in this column are unique
CREATE UNIQUE INDEX unique_decisionLetterGuid_non_null ON [dbo].[InspectorDecision](decisionLetterGuid) WHERE decisionLetterGuid IS NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
