/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `Sector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Sector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abbreviation]` on the table `SubSector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SubSector` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [Sector_abbreviation_key] ON [dbo].[Sector]([abbreviation]);

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [SubSector_abbreviation_key] ON [dbo].[SubSector]([abbreviation]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
