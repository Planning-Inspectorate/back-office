BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [guid] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [folderId] INT NOT NULL,
    [blobStorageContainer] NVARCHAR(1000),
    [blobStoragePath] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Document_status_df] DEFAULT 'waiting_for_upload',
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([guid]),
    CONSTRAINT [Document_name_folderId_key] UNIQUE NONCLUSTERED ([name],[folderId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_folderId_fkey] FOREIGN KEY ([folderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
