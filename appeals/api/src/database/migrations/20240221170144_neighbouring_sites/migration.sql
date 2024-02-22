BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Address] ADD CONSTRAINT [Address_addressCountry_df] DEFAULT 'United Kingdom' FOR [addressCountry];

-- CreateTable
CREATE TABLE [dbo].[NeighbouringSite] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [addressId] INT NOT NULL,
    CONSTRAINT [NeighbouringSite_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSite] ADD CONSTRAINT [NeighbouringSite_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSite] ADD CONSTRAINT [NeighbouringSite_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
