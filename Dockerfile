FROM node:22-alpine@sha256:152270cd4bd094d216a84cbc3c5eb1791afb05af00b811e2f0f04bdc6c473602
WORKDIR /usr/app

COPY package.json yarn.lock ./
COPY packages ./packages
COPY web ./web

RUN yarn install

# Build shared sub-project packages/common
RUN yarn workspace @vtmp/common build

RUN yarn workspace @vtmp/web build

WORKDIR /usr/app/web

EXPOSE 8000

CMD ["yarn", "dev"]

