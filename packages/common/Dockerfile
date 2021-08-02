FROM node:14-alpine
WORKDIR /opt/app
ADD src src
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm ci --production
USER node
