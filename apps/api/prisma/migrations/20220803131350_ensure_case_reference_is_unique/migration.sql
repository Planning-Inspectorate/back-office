/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Case` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [Case_reference_key] ON [dbo].[Case]([reference]) WHERE reference IS NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
