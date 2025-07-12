# link-processing-service

## Production deployment

- Build locally: docker buildx build --no-cache --platform linux/amd64 --provenance=false -f link-processing-service/Dockerfile -t vtmp-link-processor .

- Tag it for ECR: docker tag vtmp-link-processor:latest 904233113283.dkr.ecr.us-east-1.amazonaws.com/vtmp-link-processor:latest

- Push to ECR: docker push 904233113283.dkr.ecr.us-east-1.amazonaws.com/vtmp-link-processor:latest

## Local development
