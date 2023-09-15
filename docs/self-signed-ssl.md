### Creating a self-signed certificate

When developing locally, by default we are simulating the authentication workflows on AD. In order to work with the real instance of AD (which is necessary when working on permission features or [file upload](./uploading-files.md)), the site needs to run over HTTPS, and a certificate is required.

A local self-signed certificate can be created either using OS built-in tools, or using tools such as `mkcert (https://github.com/FiloSottile/mkcert)`. This tool will create a certificate for the ip address(es) or domains passed as input, e.g.: `mkcert localhost 127.0.0.1`.

Once a certificate is created, it can be put in the root of the solution, and referenced when configuring the site over HTTPS.
