# 1st stage
FROM public.ecr.aws/lambda/nodejs:22 AS builder
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy
COPY package.json yarn.lock tsconfig.base.json turbo.json ./
COPY .yarn/ .yarn/
COPY .yarnrc.yml ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN corepack enable

# Install deps
RUN yarn install --immutable

# Build
RUN yarn turbo run build --filter=@vtmp/link-processing-service

# Prune devDependencies from the final node_modules if in production only
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then \
      yarn workspaces focus --production @vtmp/link-processing-service; \
    else \
      yarn workspaces focus @vtmp/link-processing-service; \
    fi

# 2nd stage
FROM public.ecr.aws/lambda/nodejs:22
# ${LAMBDA_TASK_ROOT} is an env var automatically set in AWS Lambda base image. It points to root dir inside a Lambda
# ${LAMBDA_TASK_ROOT} is equivalent to /var/task
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder ${LAMBDA_TASK_ROOT}/tsconfig.base.json ./tsconfig.base.json
COPY --from=builder ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=builder ${LAMBDA_TASK_ROOT}/packages ./packages
COPY --from=builder ${LAMBDA_TASK_ROOT}/apps/link-processing-service ./apps/link-processing-service

CMD ["apps/link-processing-service/dist/index.handler"]

