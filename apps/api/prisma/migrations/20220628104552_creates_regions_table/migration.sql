BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Application] ADD [regionId] INT;

-- CreateTable
CREATE TABLE [dbo].[Region] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Region_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Region_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[Application] ADD CONSTRAINT [Application_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
