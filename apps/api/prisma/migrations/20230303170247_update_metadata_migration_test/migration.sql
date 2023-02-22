/*
  Warnings:

  - You are about to drop the column `dateCreated` on the `DocumentMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `datePublished` on the `DocumentMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `filter2` on the `DocumentMetadata` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [version] INT NULL;
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [documentType] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [documentGuid] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[DocumentMetadata] DROP COLUMN [dateCreated],
[datePublished],
[filter2];
ALTER TABLE [dbo].[DocumentMetadata] ADD [blobStorageContainer] NVARCHAR(1000),
[blobStoragePath] NVARCHAR(1000),
[createdAt] DATETIME2 CONSTRAINT [DocumentMetadata_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[isDeleted] BIT NOT NULL CONSTRAINT [DocumentMetadata_isDeleted_df] DEFAULT 0,
[publishedAt] DATETIME2,
[redacted] BIT NOT NULL CONSTRAINT [DocumentMetadata_redacted_df] DEFAULT 0,
[status] NVARCHAR(1000),
[webfilter] NVARCHAR(1000);

-- CreateIndex
CREATE NONCLUSTERED INDEX [webfilter] ON [dbo].[DocumentMetadata]([webfilter]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
