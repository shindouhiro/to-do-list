# Production image with Node.js
FROM node:20-slim

# Install build deps for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy only package files first to use Docker layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/

# Hoisted linker to avoid native module issues
RUN echo "node-linker=hoisted" > .npmrc

# Install deps (native modules compiled for linux here)
RUN pnpm install --no-frozen-lockfile

# Now copy rest of source code
COPY . .

# Build server & client
RUN pnpm --filter @todo-app/server build
RUN pnpm --filter @todo-app/client build

# Ensure better-sqlite3 binding compiled for Linux
RUN pnpm rebuild better-sqlite3

# Create dir for sqlite DB
RUN mkdir -p /app/data
ENV DB_PATH=/app/data/todo.db

EXPOSE 3001

CMD ["node", "packages/server/dist/index.js"]
