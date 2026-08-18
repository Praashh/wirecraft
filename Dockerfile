FROM node:20-alpine

# Install bash, grep, and sed for standard shell & verifier scripts
RUN apk add --no-cache bash grep sed

WORKDIR /workspace

# Install the lightweight test dependencies & groq-sdk
RUN npm install --no-package-lock --no-audit --no-fund vitest@^4.1.10 tsx@^4.19.2 typescript@^5.7.2 groq-sdk

ENV NODE_PATH=/workspace/node_modules

# Copy workspace source files from root
COPY package.json tsconfig.json vitest.config.ts ./
COPY src ./src
COPY evals ./evals

WORKDIR /workspace
