FROM node:12-alpine

RUN apk update && \
    apk add --no-cache --virtual .build-deps make gcc g++ python && \
    apk add git openssh

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./lerna.json /app/lerna.json

RUN npm ci

COPY ./packages/frontend/package.json /app/packages/frontend/package.json
COPY ./packages/server/package.json /app/packages/server/package.json

RUN npm run bootstrap

COPY ./packages /app/packages

RUN npm run build && \
    npm prune --production && \
    apk del .build-deps

CMD ["npm", "run", "start:prod"]
