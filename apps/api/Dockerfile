FROM node:16-alpine AS base
WORKDIR /src/app
COPY package*.json ./

FROM base AS dependencies

COPY packages/planning-inspectorate-libs packages/planning-inspectorate-libs

COPY ./apps/api .
RUN npm install --only=prod
EXPOSE 3000
CMD [ "node", "./src/server.js" ]