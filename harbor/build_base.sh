#!/bin/bash
set -euo pipefail

echo "Building wirecraft-base:latest from root Dockerfile..."
docker buildx build --load -t wirecraft-base:latest -f Dockerfile .

echo "Building wirecraft-buggy:latest for Task 2..."
docker buildx build --load -t wirecraft-buggy:latest -f - . <<EOF
FROM node:20-alpine

RUN apk add --no-cache bash grep sed

WORKDIR /workspace

RUN npm install --no-package-lock --no-audit --no-fund vitest@^4.1.10 tsx@^4.19.2 typescript@^5.7.2 groq-sdk

ENV NODE_PATH=/workspace/node_modules

COPY package.json tsconfig.json vitest.config.ts ./
COPY src ./src
COPY evals ./evals

RUN sed -i 's/take(\["pwm", "digital"\])/take(["pwm"])/' src/lib/engine/allocator.ts
RUN sed -i 's/board\.volts === 3\.3/board.volts === 5/' src/lib/engine/allocator.ts

WORKDIR /workspace
EOF

echo "✓ All Harbor images built and ready!"
