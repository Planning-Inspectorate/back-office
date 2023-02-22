/*
  Warnings:

  - You are about to drop the column `caseStudy` on the `DocumentMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `webfilter` on the `DocumentMetadata` table. All the data in the column will be lost.
  - Added the required column `publishedStatus` to the `DocumentMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `redactedStatus` to the `DocumentMetadata` table without a default value. This is not possible if the table is not empty.
  - Made the column `version` on table `DocumentMetadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `documentType` on table `DocumentMetadata` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [webfilter] ON [dbo].[DocumentMetadata];

-- AlterTable
ALTER TABLE [dbo].[DocumentMetadata] DROP CONSTRAINT [DocumentMetadata_redacted_df];
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [version] INT NOT NULL;
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [documentType] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[DocumentMetadata] DROP COLUMN [caseStudy],
[webfilter];
ALTER TABLE [dbo].[DocumentMetadata] ADD [filter2] NVARCHAR(1000),
[publishedStatus] NVARCHAR(1000) NOT NULL,
[redactedStatus] NVARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE NONCLUSTERED INDEX [filter1] ON [dbo].[DocumentMetadata]([filter1]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
