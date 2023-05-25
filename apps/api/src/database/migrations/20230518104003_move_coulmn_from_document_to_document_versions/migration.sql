/*
  Warnings:

  - You are about to drop the column `blobStorageContainer` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `blobStoragePath` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `redacted` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Document` table. All the data in the column will be lost.
  - Made the column `latestVersionId` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- Default existing latestVersionId columns to 1 so we can apply the NOT NULL constraint
UPDATE [dbo].[Document] SET latestVersionId = 1 WHERE latestVersionId IS NULL;

-- AlterTable
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_fileSize_df]
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_latestVersionId_df];
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_redacted_df];
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_status_df];
ALTER TABLE [dbo].[Document] ALTER COLUMN [latestVersionId] INT NOT NULL;
ALTER TABLE [dbo].[Document] DROP COLUMN [blobStorageContainer],
[blobStoragePath],
[fileSize],
[fileType],
[redacted],
[status];

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_version_df];
ALTER TABLE [dbo].[DocumentVersion] ADD [blobStoragePath] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
