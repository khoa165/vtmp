# FROM node:18-alpine
# WORKDIR /usr/app
# COPY package.json ./
# COPY yarn.lock ./
# RUN yarn install
# COPY . .
# RUN yarn build
# EXPOSE 8000
# CMD ["yarn", "dev"]

# FROM node:22-alpine@sha256:152270cd4bd094d216a84cbc3c5eb1791afb05af00b811e2f0f04bdc6c473602
# WORKDIR /usr/app
# COPY package.json yarn.lock ./
# COPY packages ./packages
# COPY web ./web
# RUN yarn install
# # Build shared sub-project packages/common
# RUN yarn workspace @vtmp/common build
# RUN yarn workspace @vtmp/web build
# WORKDIR /usr/app/web
# EXPOSE 8000
# CMD ["yarn", "dev"]

FROM node:22-alpine@sha256:152270cd4bd094d216a84cbc3c5eb1791afb05af00b811e2f0f04bdc6c473602 as builder
WORKDIR /usr/app

# Copy root files and workspaces (relative to build context, the '.' in docker build command, which is root)
COPY package.json yarn.lock ./
COPY packages ./packages
COPY web ./web

RUN yarn install
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/web build


FROM node:22-alpine@sha256:152270cd4bd094d216a84cbc3c5eb1791afb05af00b811e2f0f04bdc6c473602
WORKDIR /usr/app

COPY --from=builder /usr/app/web /usr/app/web
COPY --from=builder /usr/app/node_modules /usr/app/node_modules
COPY --from=builder /usr/app/packages/ /usr/app/packages/

WORKDIR /usr/app/web
EXPOSE 8000
CMD ["yarn", "start"]