BEGIN TRY

BEGIN TRAN;

IF NOT EXISTS (SELECT * FROM [dbo].[Sector] WHERE [abbreviation] = 'BC' OR [name] = 'business_and_commercial')
BEGIN
	INSERT INTO [dbo].[Sector] (abbreviation, name, displayNameEn, displayNameCy)
	VALUES ('BC', 'business_and_commercial', 'Business and Commercial', 'Business and Commercial')
END

DECLARE @sectorId INT;

SELECT @sectorId = [id] FROM [dbo].[Sector] WHERE [abbreviation] = 'BC';

IF NOT EXISTS (SELECT * FROM [dbo].[SubSector] WHERE [abbreviation] = 'BC10' OR [name] = 'data_centres')
BEGIN
	INSERT INTO [dbo].[SubSector] (abbreviation, name, displayNameEn, displayNameCy, sectorId)
	VALUES ('BC10', 'data_centres', 'Data Centres', 'Data Centres', @sectorId)
END

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
ROLLBACK TRAN;
END;
THROW

END CATCH
