FROM node:16-alpine
WORKDIR /src/app
COPY package*.json ./

COPY packages/planning-inspectorate-libs packages/planning-inspectorate-libs

COPY apps/api apps/api
ENV NODE_ENV=production
RUN npm ci
COPY apps/api/.env.development ./.env

ENV SWAGGER_JSON_DIR=./apps/api/src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/api
RUN npx prisma generate

WORKDIR /src/app

ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
        && apt-get install -y --no-install-recommends openssh-server \
        && echo "$SSH_PASSWD" | chpasswd 
COPY sshd_config /etc/ssh/
COPY init.sh /usr/local/bin/
	
RUN chmod u+x /usr/local/bin/init.sh
EXPOSE 3000 2222

# CMD [ "node", "./apps/api/src/server.js" ]
ENTRYPOINT ["init.sh"]
