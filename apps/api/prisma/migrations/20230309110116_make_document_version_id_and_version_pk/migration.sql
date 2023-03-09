/*
  Warnings:

  - The primary key for the `DocumentVersion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DocumentVersion` table. All the data in the column will be lost.
  - You are about to alter the column `documentId` on the `DocumentVersion` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `documentId` on table `DocumentVersion` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_versionId_fkey];

-- RedefineTables
BEGIN TRANSACTION;
DROP INDEX [documentGuid] ON [dbo].[DocumentVersion];
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_documentGuid_key];
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_documentId_version_key];
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_id_key];
DROP INDEX [filter1] ON [dbo].[DocumentVersion];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'DocumentVersion'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_DocumentVersion] (
    [documentId] INT NOT NULL IDENTITY(1,1),
    [version] INT NOT NULL CONSTRAINT [DocumentVersion_version_df] DEFAULT 1,
    [lastModified] DATETIME2,
    [documentType] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_documentType_df] DEFAULT '',
    [published] BIT NOT NULL CONSTRAINT [DocumentVersion_published_df] DEFAULT 0,
    [sourceSystem] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office',
    [origin] NVARCHAR(1000),
    [originalFilename] NVARCHAR(1000),
    [fileName] NVARCHAR(1000),
    [representative] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [documentGuid] NVARCHAR(1000),
    [owner] NVARCHAR(1000),
    [author] NVARCHAR(1000),
    [securityClassification] NVARCHAR(1000),
    [mime] NVARCHAR(1000),
    [horizonDataID] NVARCHAR(1000),
    [fileMD5] NVARCHAR(1000),
    [path] NVARCHAR(1000),
    [virusCheckStatus] NVARCHAR(1000),
    [size] INT,
    [stage] NVARCHAR(1000),
    [filter1] NVARCHAR(1000),
    [blobStorageContainer] NVARCHAR(1000),
    [blobStoragePath] NVARCHAR(1000),
    [createdAt] DATETIME2 CONSTRAINT [DocumentVersion_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [receivedDate] DATETIME2 CONSTRAINT [DocumentVersion_receivedDate_df] DEFAULT CURRENT_TIMESTAMP,
    [isDeleted] BIT NOT NULL CONSTRAINT [DocumentVersion_isDeleted_df] DEFAULT 0,
    [publishedAt] DATETIME2,
    [publishedDate] DATETIME2,
    [status] NVARCHAR(1000),
    [examinationRefNo] NVARCHAR(1000),
    [filter2] NVARCHAR(1000),
    [publishedStatus] NVARCHAR(1000),
    [redactedStatus] NVARCHAR(1000),
    [redacted] BIT NOT NULL CONSTRAINT [DocumentVersion_redacted_df] DEFAULT 0,
    CONSTRAINT [DocumentVersion_pkey] PRIMARY KEY CLUSTERED ([documentId],[version]),
    CONSTRAINT [DocumentVersion_documentId_key] UNIQUE NONCLUSTERED ([documentId]),
    CONSTRAINT [DocumentVersion_documentGuid_key] UNIQUE NONCLUSTERED ([documentGuid])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_DocumentVersion] ON;
IF EXISTS(SELECT * FROM [dbo].[DocumentVersion])
    EXEC('INSERT INTO [dbo].[_prisma_new_DocumentVersion] ([author],[blobStorageContainer],[blobStoragePath],[createdAt],[description],[documentGuid],[documentId],[documentType],[examinationRefNo],[fileMD5],[fileName],[filter1],[filter2],[horizonDataID],[isDeleted],[lastModified],[mime],[origin],[originalFilename],[owner],[path],[published],[publishedAt],[publishedDate],[publishedStatus],[receivedDate],[redacted],[redactedStatus],[representative],[securityClassification],[size],[sourceSystem],[stage],[status],[version],[virusCheckStatus]) SELECT [author],[blobStorageContainer],[blobStoragePath],[createdAt],[description],[documentGuid],[documentId],[documentType],[examinationRefNo],[fileMD5],[fileName],[filter1],[filter2],[horizonDataID],[isDeleted],[lastModified],[mime],[origin],[originalFilename],[owner],[path],[published],[publishedAt],[publishedDate],[publishedStatus],[receivedDate],[redacted],[redactedStatus],[representative],[securityClassification],[size],[sourceSystem],[stage],[status],[version],[virusCheckStatus] FROM [dbo].[DocumentVersion] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_DocumentVersion] OFF;
DROP TABLE [dbo].[DocumentVersion];
EXEC SP_RENAME N'dbo._prisma_new_DocumentVersion', N'DocumentVersion';
CREATE NONCLUSTERED INDEX [filter1] ON [dbo].[DocumentVersion]([filter1]);
CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentVersion]([documentGuid]);
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_versionId_fkey] FOREIGN KEY ([versionId]) REFERENCES [dbo].[DocumentVersion]([documentId]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
