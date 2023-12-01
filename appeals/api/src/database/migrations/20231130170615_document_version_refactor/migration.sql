/*
  Warnings:

  - You are about to drop the column `examinationRefNo` on the `DocumentVersion` table. All the data in the column will be lost.
  - You are about to drop the column `filter1` on the `DocumentVersion` table. All the data in the column will be lost.
  - You are about to drop the column `filter2` on the `DocumentVersion` table. All the data in the column will be lost.
  - You are about to drop the column `publishedStatus` on the `DocumentVersion` table. All the data in the column will be lost.
  - You are about to drop the column `publishedStatusPrev` on the `DocumentVersion` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [filter1] ON [dbo].[DocumentVersion];
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_publishedStatus_df]

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] DROP COLUMN [examinationRefNo],
[filter1],
[filter2],
[publishedStatus],
[publishedStatusPrev];
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_virusCheckStatus_df] DEFAULT 'not_checked' FOR [virusCheckStatus];
ALTER TABLE [dbo].[DocumentVersion] ADD [draft] BIT NOT NULL CONSTRAINT [DocumentVersion_draft_df] DEFAULT 1;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
