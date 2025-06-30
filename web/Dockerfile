# 1st stage: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is our current dir's root)
COPY package.json yarn.lock ./
COPY packages ./packages
COPY web ./web

# Install dependencies:
RUN yarn install --immutable

# Build steps:
RUN yarn workspace @vtmp/common build && yarn workspace @vtmp/server-common build
RUN yarn workspace @vtmp/web build

# Prune devDependencies from the final node_modules if in production only
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then \
      yarn install --production --immutable --ignore-scripts; \
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