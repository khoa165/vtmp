FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --immutable
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/web-client build

FROM nginx:alpine
COPY /web-client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/web-client/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]