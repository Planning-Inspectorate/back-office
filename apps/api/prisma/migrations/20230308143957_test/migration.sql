/*
  Warnings:

  - You are about to drop the column `metadataId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `DocumentMetadata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[versionId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- -- DropForeignKey
-- ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_metadataId_fkey];

-- -- DropIndex
-- ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_metadataId_key];

-- -- AlterTable
-- ALTER TABLE [dbo].[Document] DROP COLUMN [metadataId];
-- ALTER TABLE [dbo].[Document] ADD [versionId] INT;

-- -- DropTable
-- DROP TABLE [dbo].[DocumentMetadata];

-- -- CreateTable
-- CREATE TABLE [dbo].[DocumentVersion] (
--     [id] INT NOT NULL IDENTITY(1,1),
--     [version] INT NOT NULL CONSTRAINT [DocumentVersion_version_df] DEFAULT 1,
--     [lastModified] DATETIME2,
--     [documentType] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_documentType_df] DEFAULT '',
--     [published] BIT NOT NULL CONSTRAINT [DocumentVersion_published_df] DEFAULT 0,
--     [sourceSystem] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office',
--     [origin] NVARCHAR(1000),
--     [originalFilename] NVARCHAR(1000),
--     [fileName] NVARCHAR(1000),
--     [representative] NVARCHAR(1000),
--     [description] NVARCHAR(1000),
--     [documentGuid] NVARCHAR(1000),
--     [owner] NVARCHAR(1000),
--     [author] NVARCHAR(1000),
--     [securityClassification] NVARCHAR(1000),
--     [mime] NVARCHAR(1000),
--     [horizonDataID] NVARCHAR(1000),
--     [fileMD5] NVARCHAR(1000),
--     [documentId] NVARCHAR(1000),
--     [path] NVARCHAR(1000),
--     [virusCheckStatus] NVARCHAR(1000),
--     [size] INT,
--     [stage] NVARCHAR(1000),
--     [filter1] NVARCHAR(1000),
--     [blobStorageContainer] NVARCHAR(1000),
--     [blobStoragePath] NVARCHAR(1000),
--     [createdAt] DATETIME2 CONSTRAINT [DocumentVersion_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
--     [receivedDate] DATETIME2 CONSTRAINT [DocumentVersion_receivedDate_df] DEFAULT CURRENT_TIMESTAMP,
--     [isDeleted] BIT NOT NULL CONSTRAINT [DocumentVersion_isDeleted_df] DEFAULT 0,
--     [publishedAt] DATETIME2,
--     [publishedDate] DATETIME2,
--     [status] NVARCHAR(1000),
--     [examinationRefNo] NVARCHAR(1000),
--     [filter2] NVARCHAR(1000),
--     [publishedStatus] NVARCHAR(1000),
--     [redactedStatus] NVARCHAR(1000),
--     [redacted] BIT NOT NULL CONSTRAINT [DocumentVersion_redacted_df] DEFAULT 0,
--     CONSTRAINT [DocumentVersion_pkey] PRIMARY KEY CLUSTERED ([id]),
--     CONSTRAINT [DocumentVersion_id_key] UNIQUE NONCLUSTERED ([id]),
--     CONSTRAINT [DocumentVersion_documentGuid_key] UNIQUE NONCLUSTERED ([documentGuid]),
--     CONSTRAINT [DocumentVersion_documentId_version_key] UNIQUE NONCLUSTERED ([documentId],[version])
-- );

-- -- CreateIndex
-- CREATE NONCLUSTERED INDEX [filter1] ON [dbo].[DocumentVersion]([filter1]);

-- -- CreateIndex
-- CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentVersion]([documentGuid]);

-- -- CreateIndex
-- ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_versionId_key] UNIQUE NONCLUSTERED ([versionId]);

-- -- AddForeignKey
-- ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_versionId_fkey] FOREIGN KEY ([versionId]) REFERENCES [dbo].[DocumentVersion]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
