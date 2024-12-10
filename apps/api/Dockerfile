FROM node:20-alpine3.20
WORKDIR /src/app

ARG GIT_SHA

COPY package*.json ./

COPY packages ./packages

COPY apps/api apps/api
ENV NODE_ENV=production
RUN npm ci --workspaces --if-present

# relative to cwd
ENV SWAGGER_JSON_DIR=./src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL
ENV GIT_SHA=$GIT_SHA

WORKDIR /src/app/apps/api
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT npm run start
