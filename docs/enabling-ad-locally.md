### Enabling Active Directory locally

Active Directory is the repository for users and groups with access to the application. By default, the `.env.local` in the web project is configured to emulate the authentication process, and never access the real thing.

To work with AD locally (it will be required for appeals case assignment and audit), the web site needs to run over HTTPS, therefore the `.env.local` configuration needs to change in order to:

1. Use a self-signed certificate [local self-signed certificate](./self-signed-ssl.md)
2. Set `AUTH_DISABLED=false`
3. Add AD settings for the development instance

```
AUTH_CLIENT_ID=<retrieve from Azure>
AUTH_TENANT_ID=<retrieve from Azure>
AUTH_CLIENT_SECRET=<retrieve from Azure>
AUTH_REDIRECT_URI=https://localhost:8080/auth/redirect
```

4. Add the required group IDs

```
APPEALS_CASE_OFFICER_GROUP_ID=<GUID of appeals_case_officer group>
APPEALS_INSPECTOR_GROUP_ID=<GUID of appeals_inspector group>
APPEALS_LEGAL_TEAM_GROUP_ID=<GUID of legal group>
APPEALS_CS_TEAM_GROUP_ID=<GUID of custservice group>
```

5. Enable HTTPS

```
HTTPS_ENABLED=true
HTTPS_PORT=8080
# Certificate and key created in step 1.
SSL_CERT_FILE=<path/to/localhost...pem>
SSL_KEY_FILE=<path/to/localhost...-key.pem>
APP_HOSTNAME=localhost:8080
```
