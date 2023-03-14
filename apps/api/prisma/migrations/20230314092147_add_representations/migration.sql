BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [representationId] INT;

-- CreateTable
CREATE TABLE [dbo].[Representation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000) NOT NULL,
    [caseId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [originalRepresentation] NTEXT NOT NULL,
    [redactedRepresentation] NTEXT,
    [redacted] BIT NOT NULL CONSTRAINT [Representation_redacted_df] DEFAULT 0,
    [userId] INT,
    [received] DATETIME2 NOT NULL CONSTRAINT [Representation_received_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Representation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationContact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [representationId] INT NOT NULL,
    [firstName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [jobTitle] NVARCHAR(1000),
    [isOver18] BIT NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [organisationName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [addressId] INT,
    CONSTRAINT [RepresentationContact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reference] ON [dbo].[Representation]([reference]);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationContact] ADD CONSTRAINT [RepresentationContact_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationContact] ADD CONSTRAINT [RepresentationContact_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
