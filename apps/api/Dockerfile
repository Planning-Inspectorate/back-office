FROM node:18-alpine
WORKDIR /app
COPY node_modules ./node_modules
COPY packages ./packages
COPY apps/api ./apps/api

ENV NODE_ENV=production

# relative to cwd
ENV SWAGGER_JSON_DIR=./src/server/swagger-output.json

WORKDIR /app/apps/api

EXPOSE 3000
ENTRYPOINT npm run start
