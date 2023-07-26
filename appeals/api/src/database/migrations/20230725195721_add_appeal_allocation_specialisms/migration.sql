BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [allocationId] INT;

-- CreateTable
CREATE TABLE [dbo].[AppealAllocation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [level] NVARCHAR(1000) NOT NULL,
    [band] INT NOT NULL,
    CONSTRAINT [AppealAllocation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealAllocation_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealSpecialism] (
    [id] INT NOT NULL IDENTITY(1,1),
    [specialismId] INT NOT NULL,
    [appealId] INT NOT NULL,
    CONSTRAINT [AppealSpecialism_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Specialism] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Specialism_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Specialism_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppealAllocation] ADD CONSTRAINT [AppealAllocation_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealSpecialism] ADD CONSTRAINT [AppealSpecialism_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealSpecialism] ADD CONSTRAINT [AppealSpecialism_specialismId_fkey] FOREIGN KEY ([specialismId]) REFERENCES [dbo].[Specialism]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
