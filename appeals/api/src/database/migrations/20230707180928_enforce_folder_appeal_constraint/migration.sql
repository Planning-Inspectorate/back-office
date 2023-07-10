/*
  Warnings:

  - Made the column `caseId` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Folder] DROP CONSTRAINT [Folder_caseId_path_key]
ALTER TABLE [dbo].[Folder] DROP CONSTRAINT [Folder_caseId_fkey];

DELETE FROM [dbo].[Folder];

-- AlterTable
ALTER TABLE [dbo].[Folder] ALTER COLUMN [caseId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_path_key] UNIQUE NONCLUSTERED ([caseId], [path]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
