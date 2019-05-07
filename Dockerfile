FROM node:11-alpine

RUN apk update && \
    apk add --no-cache --virtual .build-deps make gcc g++ python && \
    apk add git

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./lerna.json /app/lerna.json

RUN npm ci

COPY ./packages/frontend/package.json /app/packages/frontend/package.json
COPY ./packages/server/package.json /app/packages/server/package.json

RUN npm run bootstrap

COPY ./packages /app/packages
COPY ./storage.sqlite3 /app/storage.sqlite3

RUN npm run build && \
    npm prune --production && \
    apk del .build-deps

COPY ./config.js /app/config.js

RUN adduser -h /home/alexnotes -D -s /bin/sh alexnotes && \
    chown -R alexnotes:alexnotes ./packages/frontend/src && \
    chown -R alexnotes:alexnotes ./packages/server/src && \
    chown alexnotes:alexnotes ./storage.sqlite3

USER alexnotes

CMD ["npm", "run", "start:prod"]
