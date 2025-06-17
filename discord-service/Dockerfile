# 1st stage: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is our current dir's root)
COPY package.json yarn.lock ./
COPY packages ./packages
COPY discord-service ./discord-service

# Install dependencies:
RUN yarn install --immutable

# Build steps:
RUN yarn workspace @vtmp/common build && yarn workspace @vtmp/server-common build
RUN yarn workspace @vtmp/discord-service build

# Prune devDependencies from the final node_modules if in production only
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then \
      yarn install --production --immutable --ignore-scripts; \
    fi

# 2nd stage: Final runtime image
FROM node:22-alpine
WORKDIR /app

# Copy only necessary artifacts from 1st stage into the final image
COPY --from=builder /app/discord-service /app/discord-service
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages

WORKDIR /app/discord-service
EXPOSE 4000
CMD ["yarn", "start"]