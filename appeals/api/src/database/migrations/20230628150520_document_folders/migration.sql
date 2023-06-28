/*
  Warnings:

  - You are about to drop the column `displayNameEn` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `parentFolderId` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Appeal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caseId,path]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] DROP CONSTRAINT [ExaminationTimetableItem_folderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Folder] DROP CONSTRAINT [Folder_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Folder] DROP CONSTRAINT [Folder_parentFolderId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Folder] DROP CONSTRAINT [Folder_caseId_displayNameEn_parentFolderId_key];

-- AlterTable
ALTER TABLE [dbo].[Folder] DROP COLUMN [displayNameEn],
[displayOrder],
[parentFolderId];
ALTER TABLE [dbo].[Folder] ADD [displayName] NVARCHAR(1000),
[path] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_reference_key] UNIQUE NONCLUSTERED ([reference]);

-- CreateIndex
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_path_key] UNIQUE NONCLUSTERED ([caseId], [path]);

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
