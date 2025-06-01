# 1st stage: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy yarn configuration and binary
COPY .yarn/releases/yarn-4.8.1.cjs .yarn/releases/yarn-4.8.1.cjs
COPY .yarnrc.yml ./

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is our current dir's root)
# Copying all package.json before install (for better Docker layer caching)
COPY package.json yarn.lock ./
COPY packages/common/package.json ./packages/common/package.json
COPY web/package.json ./web/package.json
COPY web-client/package.json ./web-client/package.json
COPY discord-service/package.json ./discord-service/package.json
COPY discord-bot/package.json ./discord-bot/package.json

RUN yarn install --immutable

# Now copy all source code necessary for build steps
COPY packages ./packages
COPY web ./web

# Build steps:
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/web build

# Prune devDependencies from the final node_modules if in production only
# Use yarn workspace focus to only include dep for @vtmp/web, prune others
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then \
      yarn workspaces focus --production @vtmp/web; \
    fi

# 2nd stage: Final runtime image
FROM node:22-alpine
WORKDIR /app

# Copy only necessary artifacts from 1st stage into the final image
COPY --from=builder /app/web /app/web
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages

WORKDIR /app/web
EXPOSE 8000
CMD ["yarn", "start"]