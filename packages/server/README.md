# Server Configuration

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - SQLite database file path (default: ./data/todo.db)

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `POST /api/todos/bulk` - Bulk create todos
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos` - Delete all todos

## File Structure

```
server/
├── index.ts                        # Main server entry point
├── db.ts                           # Database initialization
├── logger.ts                       # Logging utility
├── middleware.ts                   # Express middleware
├── types.ts                        # TypeScript type definitions
├── controllers/
│   ├── categories.controller.ts    # Category route handlers
│   └── todos.controller.ts         # Todo route handlers
├── routes/
│   ├── index.ts                    # Main API router
│   ├── categories.routes.ts        # Category routes
│   └── todos.routes.ts             # Todo routes
├── package.json                    # Server package metadata
└── tsconfig.json                   # TypeScript configuration
```

## Development

```bash
# Start server with auto-reload
npm run dev

# Start server
npm start
```

## Production

The server serves both the API and the static frontend files from the `dist` directory.
