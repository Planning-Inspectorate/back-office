/*
  Warnings:

  - Added the required column `displayOrder` to the `ZoomLevel` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ApplicationDetails] DROP CONSTRAINT [ApplicationDetails_zoomLevelId_fkey];

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[ZoomLevel] DROP CONSTRAINT [ZoomLevel_name_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'ZoomLevel'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_ZoomLevel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [displayOrder] INT NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ZoomLevel_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ZoomLevel_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [ZoomLevel_displayOrder_key] UNIQUE NONCLUSTERED ([displayOrder])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_ZoomLevel] ON;
IF EXISTS(SELECT * FROM [dbo].[ZoomLevel])
    EXEC('INSERT INTO [dbo].[_prisma_new_ZoomLevel] ([displayNameCy],[displayNameEn],[id],[name]) SELECT [displayNameCy],[displayNameEn],[id],[name] FROM [dbo].[ZoomLevel] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_ZoomLevel] OFF;
DROP TABLE [dbo].[ZoomLevel];
EXEC SP_RENAME N'dbo._prisma_new_ZoomLevel', N'ZoomLevel';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_zoomLevelId_fkey] FOREIGN KEY ([zoomLevelId]) REFERENCES [dbo].[ZoomLevel]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
