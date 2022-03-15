/*
  Warnings:

  - Added the required column `addressId` to the `Appeal` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [addressId] INT NOT NULL,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [Appeal_status_df] DEFAULT 'submitted';

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressLine1] NVARCHAR(1000) NOT NULL,
    [addressLine2] NVARCHAR(1000),
    [addressLine3] NVARCHAR(1000),
    [addressLine4] NVARCHAR(1000),
    [addressLine5] NVARCHAR(1000),
    [addressLine6] NVARCHAR(1000),
    [postcode] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Address_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
