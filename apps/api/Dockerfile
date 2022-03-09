FROM node:16-alpine
WORKDIR /src/app
COPY package*.json ./

COPY packages/planning-inspectorate-libs packages/planning-inspectorate-libs

COPY apps/api apps/api
RUN npm install --only=prod
COPY apps/api/.env.development ./.env
EXPOSE 3000
CMD [ "node", "./apps/api/src/server.js" ]