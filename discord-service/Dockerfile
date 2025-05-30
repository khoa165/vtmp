FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages ./packages
COPY discord-service ./discord-service
COPY web/package.json ./web/package.json

RUN yarn install --immutable
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/discord-service build

WORKDIR /app/discord-service
EXPOSE 8080
CMD [ "yarn", "start" ]