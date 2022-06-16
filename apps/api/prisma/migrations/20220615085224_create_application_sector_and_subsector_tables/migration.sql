BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Application] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Application_status_df] DEFAULT 'open',
    [reference] NVARCHAR(1000) NOT NULL,
    [modifiedAt] DATETIME2 NOT NULL,
    [subSectorId] INT NOT NULL,
    CONSTRAINT [Application_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Sector] (
    [id] INT NOT NULL IDENTITY(1,1),
    [abbreviation] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Sector_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubSector] (
    [id] INT NOT NULL IDENTITY(1,1),
    [abbreviation] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    [sectorId] INT NOT NULL,
    CONSTRAINT [SubSector_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Application] ADD CONSTRAINT [Application_subSectorId_fkey] FOREIGN KEY ([subSectorId]) REFERENCES [dbo].[SubSector]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubSector] ADD CONSTRAINT [SubSector_sectorId_fkey] FOREIGN KEY ([sectorId]) REFERENCES [dbo].[Sector]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
