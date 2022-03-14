# Stage 1/2
FROM node:16-alpine AS pins-web-builder

WORKDIR /usr/src/app

COPY package.json .

RUN npm ci --loglevel notice

COPY packages/planning-inspectorate-libs ./packages/planning-inspectorate-libs
COPY apps/web ./apps/web
COPY turbo.json .

ENV NODE_ENV=production
ENV APP_RELEASE=true

RUN npm run build:release

# Stage 2/2
FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=pins-web-builder /usr/src/app ./

EXPOSE 8080

CMD [ "node", "./apps/web/src/server/server.js" ]
