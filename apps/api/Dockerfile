FROM node:18-alpine
WORKDIR /src/app
COPY package*.json ./

COPY packages ./packages

COPY apps/api apps/api
ENV NODE_ENV=production
RUN npm ci

# relative to cwd
ENV SWAGGER_JSON_DIR=./src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/api
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT npm run start
