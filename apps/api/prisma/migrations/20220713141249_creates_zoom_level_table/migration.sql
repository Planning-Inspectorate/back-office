BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Application] ADD [zoomLevelId] INT;

-- CreateTable
CREATE TABLE [dbo].[ZoomLevel] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ZoomLevel_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ZoomLevel_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[Application] ADD CONSTRAINT [Application_zoomLevelId_fkey] FOREIGN KEY ([zoomLevelId]) REFERENCES [dbo].[ZoomLevel]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
