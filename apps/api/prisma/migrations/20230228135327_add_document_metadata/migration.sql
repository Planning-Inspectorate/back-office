/*
  Warnings:

  - A unique constraint covering the columns `[metadataId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ALTER COLUMN [fileSize] INT NULL;
ALTER TABLE [dbo].[Document] ADD [metadataId] INT;

-- CreateTable
CREATE TABLE [dbo].[DocumentMetadata] (
    [id] INT NOT NULL IDENTITY(1,1),
    [version] INT NOT NULL,
    [dateCreated] DATETIME2 NOT NULL,
    [lastModified] DATETIME2,
    [documentType] NVARCHAR(1000) NOT NULL,
    [published] BIT NOT NULL CONSTRAINT [DocumentMetadata_published_df] DEFAULT 0,
    [sourceSystem] NVARCHAR(1000),
    [origin] NVARCHAR(1000),
    [representative] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [datePublished] DATETIME2,
    [owner] NVARCHAR(1000),
    [author] NVARCHAR(1000),
    [securityClassification] NVARCHAR(1000),
    [mime] NVARCHAR(1000),
    [horizonDataID] NVARCHAR(1000),
    [fileMD5] NVARCHAR(1000),
    [path] NVARCHAR(1000),
    [virusCheckStatus] NVARCHAR(1000),
    [size] INT,
    [stage] INT,
    [filter1] NVARCHAR(1000),
    [filter2] NVARCHAR(1000),
    CONSTRAINT [DocumentMetadata_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentMetadata_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [DocumentMetadata_documentGuid_key] UNIQUE NONCLUSTERED ([documentGuid])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentMetadata]([documentGuid]);

-- CreateIndex
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_metadataId_key] UNIQUE NONCLUSTERED ([metadataId]);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_metadataId_fkey] FOREIGN KEY ([metadataId]) REFERENCES [dbo].[DocumentMetadata]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
