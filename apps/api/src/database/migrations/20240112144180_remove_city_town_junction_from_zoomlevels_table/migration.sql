/*
  Delete the zoom levels for town, city and junction
  Update those application details that referenced the above to a zoom level of district

*/
BEGIN TRY

BEGIN TRAN;

UPDATE [dbo].[ApplicationDetails] SET zoomLevelId = (SELECT [id] FROM [dbo].[ZoomLevel] WHERE name = 'district') WHERE zoomLevelId in (SELECT [id] FROM [dbo].[ZoomLevel] WHERE name = 'town' or name = 'city' or name = 'junction');
DELETE FROM [dbo].[ZoomLevel] WHERE name = 'town' or name = 'city' or name = 'junction'

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
