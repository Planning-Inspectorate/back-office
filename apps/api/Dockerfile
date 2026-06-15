# ---- Build stage ----
# Compiles native deps (better-sqlite3) and generates the Prisma client
FROM node:22-alpine3.22 AS builder
WORKDIR /src/app

ARG GIT_SHA

# Toolchain required to build native modules from source on musl/Alpine
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY packages ./packages
COPY apps/api apps/api

ENV NODE_ENV=production
ENV GIT_SHA=$GIT_SHA

# Install all workspace deps (builds better-sqlite3 from source)
RUN npm ci --workspaces --if-present

# Generate Prisma client into apps/api/src/database/client (+ tsc compile)
WORKDIR /src/app/apps/api
RUN npm run prisma-generate

# ---- Runtime stage ----
# Clean image with no compilers; just the built app + node_modules
FROM node:22-alpine3.22 AS runtime
WORKDIR /src/app

ARG GIT_SHA

ENV NODE_ENV=production
ENV GIT_SHA=$GIT_SHA
# relative to the api working directory
ENV SWAGGER_JSON_DIR=./src/server/swagger-output.json

# Copy installed dependencies (incl. compiled better-sqlite3 .node binary)
COPY --from=builder /src/app/node_modules ./node_modules
COPY --from=builder /src/app/packages ./packages
COPY --from=builder /src/app/package*.json ./

# Copy the api app — includes the generated Prisma client (src/database/client)
COPY --from=builder /src/app/apps/api ./apps/api

WORKDIR /src/app/apps/api

EXPOSE 3000

ENTRYPOINT npm run start
