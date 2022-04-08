FROM node:16-alpine
WORKDIR /src/app
COPY package*.json ./

COPY packages/planning-inspectorate-libs packages/planning-inspectorate-libs

COPY apps/api apps/api
ENV NODE_ENV=production
RUN npm ci
COPY apps/api/.env.development ./.env
COPY apps/api/init.sh ./init.sh
COPY apps/api/sshd_config /etc/ssh/

RUN mkdir -p /tmp
COPY apps/api/ssh_setup.sh /tmp

ENV SWAGGER_JSON_DIR=./apps/api/src/server/swagger-output.json
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /src/app/apps/api
RUN npx prisma generate

WORKDIR /src/app

RUN apk add openssh \
     && echo "root:Docker!" | chpasswd 

RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)

RUN chmod u+x /src/app/init.sh
EXPOSE 3000 2222

ENTRYPOINT ["sh", "/src/app/init.sh"]
