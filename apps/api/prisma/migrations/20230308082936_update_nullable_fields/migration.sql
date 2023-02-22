/*
  Warnings:

  - You are about to drop the column `caseStudy` on the `DocumentMetadata` table. All the data in the column will be lost.
  - Made the column `sourceSystem` on table `DocumentMetadata` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [sourceSystem] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [publishedStatus] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [redactedStatus] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[DocumentMetadata] DROP COLUMN [caseStudy];
ALTER TABLE [dbo].[DocumentMetadata] ADD CONSTRAINT [DocumentMetadata_documentType_df] DEFAULT '' FOR [documentType], CONSTRAINT [DocumentMetadata_redacted_df] DEFAULT 0 FOR [redacted], CONSTRAINT [DocumentMetadata_sourceSystem_df] DEFAULT 'backoffice' FOR [sourceSystem], CONSTRAINT [DocumentMetadata_version_df] DEFAULT 1 FOR [version];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
