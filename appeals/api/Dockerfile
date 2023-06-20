FROM node:16-alpine3.16
WORKDIR /src/app
COPY package*.json ./

COPY packages ./packages

COPY appeals/api apps/api
ENV NODE_ENV=production
RUN npm ci
COPY appeals/api/.env.development ./.env
COPY appeals/api/init.sh ./init.sh

ENV SWAGGER_JSON_DIR=./apps/api/src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/api
RUN npx prisma generate

WORKDIR /src/app

EXPOSE 3000

ENTRYPOINT ["sh", "/src/app/init.sh"]
