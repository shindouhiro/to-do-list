# Calendar Todo App - Monorepo

A full-stack todo application with calendar view, built with React, Express, and SQLite.

## 📁 Project Structure

```
calendar-todo-app/
├── packages/
│   ├── client/          # React frontend
│   │   ├── src/
│   │   ├── public/
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── server/          # Express backend
│       ├── controllers/
│       ├── routes/
│       ├── index.ts
│       └── package.json
├── dist/                # Built frontend (generated)
├── data/                # SQLite database (generated)
├── pnpm-workspace.yaml
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- pnpm >= 9

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Run both client and server in parallel
pnpm dev

# Or run individually
pnpm dev:client  # Frontend only (port 3000)
pnpm dev:server  # Backend only (port 3001)
```

### Build

```bash
# Build all packages
pnpm build

# Or build individually
pnpm build:client
pnpm build:server
```

### Production

```bash
# Build frontend first
pnpm build:client

# Start server (serves API + static files)
pnpm start:server
```

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

## 📦 Packages

### @todo-app/client
React frontend with:
- TanStack Router
- Tailwind CSS
- Vite
- TypeScript

### @todo-app/server
Express backend with:
- SQLite database (better-sqlite3)
- TypeScript
- RESTful API
- CORS support

## 🛠️ Available Scripts

### Root Level
- `pnpm dev` - Run all packages in dev mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all node_modules and build artifacts

### Client Package
- `pnpm dev:client` - Start Vite dev server
- `pnpm build:client` - Build for production

### Server Package
- `pnpm dev:server` - Start server with hot reload
- `pnpm start:server` - Start production server

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - SQLite database path (default: ./data/todo.db)

## 📝 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `POST /api/todos/bulk` - Bulk create todos
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `DELETE /api/todos` - Delete all todos

## 📄 License

MIT
