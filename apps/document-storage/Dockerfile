FROM node:18.13-alpine3.16
WORKDIR /src/app
COPY package*.json ./

COPY packages ./packages

COPY apps/document-storage apps/document-storage
ENV NODE_ENV=production
RUN npm ci
COPY apps/document-storage/.env.development ./.env
COPY apps/document-storage/init.sh ./init.sh

ENV SWAGGER_JSON_DIR=./apps/document-storage/src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/document-storage

WORKDIR /src/app

EXPOSE 3000

ENTRYPOINT ["sh", "/src/app/init.sh"]
