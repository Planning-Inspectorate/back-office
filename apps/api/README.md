# Docker Build

Prepare the build environment (run these commands from ./apps/api). Change the hostname of your database URL to the name of your MSSQL container.
```shell
npm ci --omit=dev
export DATABASE_URL="database_url" # This will be set in pipelines or may be set by your local .env file
npx prisma generate 
```

Then build and run the container (run these commands from root). You'll first need to launch your MSSQL Database container in a network called "db_network". 
```shell
docker build -t api:latest -f apps/api/Dockerfile .
docker run -d -p 3000:3000 --network db_network --name api api:latest  
```
