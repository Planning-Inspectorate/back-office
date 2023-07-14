FROM node:16-alpine3.16
WORKDIR /src/app
COPY package*.json ./

COPY packages ./packages

COPY appeals/api appeals/api
ENV NODE_ENV=production
RUN npm ci
COPY appeals/api/.env.development ./.env

# relative to cwd
ENV SWAGGER_JSON_DIR=./src/server/openapi.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/appeals/api
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT npm run start
