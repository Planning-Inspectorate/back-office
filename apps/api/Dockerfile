FROM node:16-alpine
WORKDIR /src/app
COPY package*.json ./

COPY packages/planning-inspectorate-libs packages/planning-inspectorate-libs

COPY apps/api apps/api
ENV NODE_ENV=production
RUN npm ci
COPY apps/api/.env.development ./.env
EXPOSE 3000
ENV SWAGGER_JSON_DIR=./apps/api/src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/api
RUN npx prisma generate

WORKDIR /src/app
CMD [ "node", "./apps/api/src/server.js" ]
