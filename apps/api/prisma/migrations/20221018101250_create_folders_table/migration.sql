BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Folder] (
    [id] INT NOT NULL IDENTITY(1,1),
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayOrder] INT,
    [parentFolderId] INT,
    [caseId] INT,
    CONSTRAINT [Folder_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_parentFolderId_fkey] FOREIGN KEY ([parentFolderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
