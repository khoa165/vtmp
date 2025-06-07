# 1st stage
FROM public.ecr.aws/lambda/nodejs:22 AS builder
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy
COPY package.json yarn.lock ./
COPY packages ./packages
COPY link-processing-service ./link-processing-service

# Install Yarn
RUN corepack enable

# Install deps
RUN yarn install --immutable

# Build
RUN yarn workspace @vtmp/common build
RUN yarn workspace @vtmp/link-processing-service build

# 2nd stage
FROM public.ecr.aws/lambda/nodejs:22
# ${LAMBDA_TASK_ROOT} is an env var automatically set in AWS Lambda base image. It points to root dir inside a Lambda
# ${LAMBDA_TASK_ROOT} is equivalent to /var/task
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=builder ${LAMBDA_TASK_ROOT}/packages ./packages
COPY --from=builder ${LAMBDA_TASK_ROOT}/link-processing-service ./link-processing-service

CMD ["link-processing-service/dist/index.handler"]

