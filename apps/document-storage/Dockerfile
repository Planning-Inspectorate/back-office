FROM node:16-alpine
WORKDIR /src/app
COPY package*.json ./

COPY packages ./packages

COPY apps/document-storage apps/document-storage
ENV NODE_ENV=production
RUN npm ci
COPY apps/document-storage/.env.development apps/document-storage/.env

# relative to cwd
ENV SWAGGER_JSON_DIR=./src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/document-storage

EXPOSE 3000

ENTRYPOINT npm run start
