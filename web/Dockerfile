# 1st stage: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is our current dir's root)
COPY package.json yarn.lock ./
COPY packages ./packages
COPY web ./web

# Build steps:
RUN yarn install --immutable
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/web build

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