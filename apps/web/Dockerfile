# 1st stage: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is our current dir's root)
COPY package.json yarn.lock tsconfig.base.json turbo.json ./
COPY .yarn/ .yarn/
COPY .yarnrc.yml ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN corepack enable

# Install dependencies:
RUN yarn install --immutable

# Build steps:
# Leverage turborepo build cache, and only target the @vtmp/web workspace (build only web and its dependencies)
RUN yarn turbo run build --filter=@vtmp/web

# Prune devDependencies from the final node_modules if in production only
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then \
      yarn workspaces focus --production @vtmp/web; \
    else \
      yarn workspaces focus @vtmp/web; \
    fi

# 2nd stage: Final runtime image
FROM node:22-alpine
WORKDIR /app

# Copy only necessary artifacts from 1st stage into the final image
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web

WORKDIR /app/apps/web
EXPOSE 8000
CMD ["yarn", "start"]