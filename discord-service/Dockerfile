# 1st stage:
FROM node:22-alpine AS builder
WORKDIR /app

COPY discord-service/package.json ./discord-service/package.json
RUN cd discord-service && yarn install

COPY discord-service ./discord-service
RUN cd discord-service && yarn build

# 2nd stage:
FROM node:22-alpine
WORKDIR /app

# Copy only necessary artifacts from 1st stage
COPY --from=builder /app/discord-service/dist /app/discord-service/dist
COPY --from=builder /app/discord-service/node_modules /app/discord-service/node_modules
COPY --from=builder /app/discord-service/package.json /app/discord-service/package.json

WORKDIR /app/discord-service
EXPOSE 4000
CMD [ "yarn", "start" ]