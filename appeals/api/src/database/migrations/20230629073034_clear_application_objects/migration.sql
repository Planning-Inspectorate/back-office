/*
  Warnings:

  - You are about to drop the `ApplicationDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Case` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CaseStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExaminationTimetableItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExaminationTimetableType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GridReference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegionsOnApplicationDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sector` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubSector` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZoomLevel` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ApplicationDetails] DROP CONSTRAINT [ApplicationDetails_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ApplicationDetails] DROP CONSTRAINT [ApplicationDetails_subSectorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ApplicationDetails] DROP CONSTRAINT [ApplicationDetails_zoomLevelId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CaseStatus] DROP CONSTRAINT [CaseStatus_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] DROP CONSTRAINT [ExaminationTimetableItem_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] DROP CONSTRAINT [ExaminationTimetableItem_examinationTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[GridReference] DROP CONSTRAINT [GridReference_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[RegionsOnApplicationDetails] DROP CONSTRAINT [RegionsOnApplicationDetails_applicationDetailsId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[RegionsOnApplicationDetails] DROP CONSTRAINT [RegionsOnApplicationDetails_regionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Representation] DROP CONSTRAINT [Representation_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ServiceCustomer] DROP CONSTRAINT [ServiceCustomer_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SubSector] DROP CONSTRAINT [SubSector_sectorId_fkey];

-- DropTable
DROP TABLE [dbo].[ApplicationDetails];

-- DropTable
DROP TABLE [dbo].[Case];

-- DropTable
DROP TABLE [dbo].[CaseStatus];

-- DropTable
DROP TABLE [dbo].[ExaminationTimetableItem];

-- DropTable
DROP TABLE [dbo].[ExaminationTimetableType];

-- DropTable
DROP TABLE [dbo].[GridReference];

-- DropTable
DROP TABLE [dbo].[Region];

-- DropTable
DROP TABLE [dbo].[RegionsOnApplicationDetails];

-- DropTable
DROP TABLE [dbo].[Sector];

-- DropTable
DROP TABLE [dbo].[SubSector];

-- DropTable
DROP TABLE [dbo].[ZoomLevel];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
