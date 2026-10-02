/*
  Warnings:

  - A unique constraint covering the columns `[caseId,categoryCode,categoryName]` on the table `ExaminationLibraryCategory` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [DocumentVersion_examinationLibraryIndex_idx] ON [dbo].[DocumentVersion];

-- DropIndex
ALTER TABLE [dbo].[ExaminationLibraryCategory] DROP CONSTRAINT [ExaminationLibraryCategory_caseId_categoryCode_key];

-- AlterTable
-- Keep the indexed key bounded to avoid SQL Server index key-size issues on long values.
ALTER TABLE [dbo].[DocumentVersion] ALTER COLUMN [examinationLibraryIndex] NVARCHAR(255) NULL;
ALTER TABLE [dbo].[DocumentVersion] ADD [examinationLibraryReferenceLocked] BIT NOT NULL CONSTRAINT [DocumentVersion_examinationLibraryReferenceLocked_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[ExaminationLibraryCategory] DROP CONSTRAINT [ExaminationLibraryCategory_publishedStatus_df];
ALTER TABLE [dbo].[ExaminationLibraryCategory] ADD CONSTRAINT [ExaminationLibraryCategory_publishedStatus_df] DEFAULT 'in progress' FOR [publishedStatus];

-- CreateIndex
CREATE NONCLUSTERED INDEX [DocumentVersion_examinationLibraryIndex_idx] ON [dbo].[DocumentVersion]([examinationLibraryIndex]);

-- CreateIndex
ALTER TABLE [dbo].[ExaminationLibraryCategory] ADD CONSTRAINT [ExaminationLibraryCategory_caseId_categoryCode_categoryName_key] UNIQUE NONCLUSTERED ([caseId], [categoryCode], [categoryName]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
