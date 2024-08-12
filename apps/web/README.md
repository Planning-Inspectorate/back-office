# CBOS Web

## Structure

```
.
+-- environment
+-- scripts
+-- src
|   +-- client
|   |   +-- ...
|   +-- common
|   |   +-- ...
|   +-- server
|   |   +-- app
|   |   |   +-- ...
|   |   +-- applications
|   |   |   +-- ...
|   |   +-- lib
|   |   |   +-- ...
|   |   +-- static
|   |   |   +-- ...
|   |   +-- views
|   |   |   +-- ...
|   +-- styles
|   |   +-- ...
+-- testing
```

|-|-|
|---------------------------|-------------------------------------------------------|
| `environment`             | Code for setting up configuration passed into the app |
| `scripts`                 | Build scripts                                         |
| `src/client`              | JavaScript code to be run on the client-side          |
| `src/common`              | Code that can be used on the server or client         |
| `src/server/app`          | Top-level server code (e.g. Express setup and auth)   |
| `src/server/applications` | Main app code (routes, controllers, service methods)  |
| `src/server/lib`          | Shared, generic code                                  |
| `src/server/static`       | Files to be made publicly available in the deployment |
| `src/server/views`        | Nunjucks files for rendering pages                    |
| `src/styles`              | Sass styles                                           |
| `testing`                 | Code to support Jest tests                            |
