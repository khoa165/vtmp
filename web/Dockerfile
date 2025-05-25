# Multi-stages build

# 1st stage: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is root)
COPY package.json yarn.lock ./
RUN yarn install

COPY packages ./packages
COPY web ./web

RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/web build

# 2nd stage: Final runtime image
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/web /app/web
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages

WORKDIR /app/web
EXPOSE 8000
CMD ["yarn", "start"]