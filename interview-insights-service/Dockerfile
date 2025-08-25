# 1st stage
FROM public.ecr.aws/lambda/nodejs:22 AS builder
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy
COPY package.json yarn.lock tsconfig.base.json ./
COPY packages ./packages
COPY interview-insights-service ./interview-insights-service

# Install Yarn
RUN corepack enable

# Install deps
RUN yarn install --immutable

# Build
RUN yarn workspace @vtmp/common build && yarn workspace @vtmp/server-common build
RUN yarn workspace @vtmp/interview-insights-service build

# Prune devDependencies from the final node_modules if in production only
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then \
      yarn install --production --immutable --ignore-scripts; \
    fi

# 2nd stage
FROM public.ecr.aws/lambda/nodejs:22
# ${LAMBDA_TASK_ROOT} is an env var automatically set in AWS Lambda base image. It points to root dir inside a Lambda
# ${LAMBDA_TASK_ROOT} is equivalent to /var/task
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder ${LAMBDA_TASK_ROOT}/tsconfig.base.json ${LAMBDA_TASK_ROOT}/tsconfig.base.json
COPY --from=builder ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=builder ${LAMBDA_TASK_ROOT}/packages ./packages
COPY --from=builder ${LAMBDA_TASK_ROOT}/interview-insights-service ./interview-insights-service

CMD ["interview-insights-service/dist/index.handler"]