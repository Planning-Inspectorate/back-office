### Creating a self-signed certificate

When developing locally, by default we are simulating the authentication workflows on AD. In order to work with the real instance of AD (which is necessary when working on permission features or [file upload](./uploading-files.md)), the site needs to run over HTTPS, and a certificate is required.

A local self-signed certificate can be created either using OS built-in tools, or using tools such as `mkcert (https://github.com/FiloSottile/mkcert)`. This tool will create a certificate for the ip address(es) or domains passed as input, e.g.: `mkcert localhost 127.0.0.1`.

Once a certificate is created, it can be put in the root of the solution, and referenced when configuring the site over HTTPS.

#### Windows steps

1. Navigate to back-office/appeals/web in your terminal
2. Run the following command to generate the pem files:

```
&"C:\Program Files\Git\usr\bin\openssl" req -newkey rsa:2048 -x509 -nodes -keyout key.pem -new -out cert.pem -sha256 -days 365 -addext "subjectAltName=IP:127.0.0.1" -subj "/C=CO/ST=ST/L=LO/O=OR/OU=OU/CN=CN"
```

3. Then run the following command to add the certificate to the `Trusted Root Certification Authorities`:

```
certutil –addstore -enterprise –f "Root" cert.pem
```
