/*
  Warnings:

  - Added the required column `caseId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- Seed caseId for pre-existing records
WITH folder_tree AS (
  SELECT
    id,
    caseId
  FROM
    Folder
  WHERE
    caseId IS NOT NULL

  UNION ALL

  SELECT
    f.id,
    ft.caseId
  FROM
    Folder f
    INNER JOIN folder_tree ft ON f.parentFolderId = ft.id
  WHERE
    f.caseId IS NULL
)
UPDATE Document
SET caseId = folder_tree.caseId
FROM
  Document
  INNER JOIN folder_tree ON Document.folderId = folder_tree.id;

-- Make the column non-nullable
ALTER TABLE [dbo].[Document] ALTER COLUMN [caseId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
