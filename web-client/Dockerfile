FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY .yarn/ .yarn/
COPY .yarnrc.yml ./
COPY packages/ ./packages/
COPY web-client/ ./web-client/

RUN corepack enable

# Install dependencies:
RUN yarn install --immutable

# Build steps:
# Leverage turborepo build cache, and only target the @vtmp/web-client workspace (build only web-client and its dependencies)
RUN yarn turbo run build --filter=@vtmp/web-client

# 2nd stage: final runtime image, only copy static build asset from web-client/dist
FROM nginx:alpine
COPY /web-client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/web-client/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]