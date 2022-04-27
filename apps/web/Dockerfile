# Stage 1/2 - Builder
FROM node:16-alpine AS pins-web-builder

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY turbo.json .

COPY packages ./packages
COPY apps/web ./apps/web

RUN npm ci --loglevel notice

ENV NODE_ENV=production
ENV APP_RELEASE=true

# TODO: This should not be here
# The .git folder although not copied should not be there.
RUN rm -rf .git

RUN npm run build:release

# --------------------------------

# Stage 2/2 - App run
FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=pins-web-builder /usr/src/app ./

WORKDIR /usr/src/app/apps/web

ENV NODE_ENV=production
ENV APP_RELEASE=true

# TODO: Perhaps use `RUN npm ci --production` to shrink the size of the container

EXPOSE 8080

CMD [ "node", "./src/server/server.js" ]
