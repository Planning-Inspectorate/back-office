BEGIN TRY

BEGIN TRAN;
    -- Populate displayName field with organisationName or firstName and lastName
    UPDATE [ServiceUser]
    SET displayName =
       CASE
          WHEN organisationName IS NOT NULL AND organisationName <> '' THEN organisationName
          WHEN firstName IS NOT NULL AND firstName <> '' AND lastName IS NOT NULL AND lastName <> '' THEN CONCAT(firstName, ' ', lastName)
          WHEN firstName IS NOT NULL AND firstName <> '' THEN firstName
          WHEN lastName IS NOT NULL AND lastName <> '' THEN lastName
          ELSE NULL
       END;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
