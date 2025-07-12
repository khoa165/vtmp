# 1st stage:
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/common ./packages/common
COPY apps/web-client ./apps/web-client

# Install dependencies:
RUN yarn install --immutable

# Build steps:
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/web-client build

# 2nd stage: final runtime image, only copy static build asset from web-client/dist
FROM nginx:alpine
COPY --from=builder /app/apps/web-client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web-client/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]