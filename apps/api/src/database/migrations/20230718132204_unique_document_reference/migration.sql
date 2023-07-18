/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Made the column `reference` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `ExaminationTimetableItem` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

UPDATE [dbo].[Document] SET reference = NEWID() WHERE reference IS NULL;

-- AlterTable
ALTER TABLE [dbo].[Document] ALTER COLUMN [reference] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_reference_key] UNIQUE NONCLUSTERED ([reference]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
