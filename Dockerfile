# Production image with Node.js
FROM node:20-slim

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy all source code
COPY . .

# Configure pnpm to use hoisted linker to avoid native module issues
RUN echo "node-linker=hoisted" > .npmrc

# Install all dependencies in the container
# Note: Using --no-frozen-lockfile to allow lockfile recreation if needed
RUN pnpm install --no-frozen-lockfile

# Build server in the container
RUN pnpm --filter @todo-app/server build

# Build client in the container (if not already built)
RUN pnpm --filter @todo-app/client build

# Create directory for database
RUN mkdir -p /app/data
ENV DB_PATH=/app/data/todo.db

# Expose port 3001
EXPOSE 3001

# Start server
CMD ["node", "packages/server/dist/index.js"]
