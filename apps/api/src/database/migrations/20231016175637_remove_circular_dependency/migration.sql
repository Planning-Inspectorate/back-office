BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_applicantId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[RepresentationContact] DROP CONSTRAINT [RepresentationContact_addressId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[RepresentationContact] DROP CONSTRAINT [RepresentationContact_representationId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicantId_fkey] FOREIGN KEY ([applicantId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationContact] ADD CONSTRAINT [RepresentationContact_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationContact] ADD CONSTRAINT [RepresentationContact_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
