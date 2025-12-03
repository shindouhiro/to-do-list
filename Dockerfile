# Production image with Node.js
FROM node:20-alpine

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package files
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy server code
COPY packages/server ./packages/server

# Copy built frontend files
COPY dist ./dist

# Create directory for database
RUN mkdir -p /app/data
ENV DB_PATH=/app/data/todo.db

# Expose port 3000
EXPOSE 3000

# Start server
CMD ["pnpm", "start:server"]
