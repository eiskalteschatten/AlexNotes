FROM node:11-alpine

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm ci

COPY ./frontend/package.json /app/frontend/package.json
COPY ./frontend/package-lock.json /app/frontend/package-lock.json

RUN cd ./frontend && npm ci

COPY ./server/package.json /app/server/package.json
COPY ./server/package-lock.json /app/server/package-lock.json

RUN cd ./server && npm ci

COPY ./frontend /app/frontend
COPY ./server /app/server

RUN adduser -h /home/alexnotes -D -s /bin/sh alexnotes && \
    chown -R alexnotes:alexnotes ./frontend/src && \
    chown -R alexnotes:alexnotes ./server/src

USER alexnotes

CMD ["npm", "run", "start:prod"]
