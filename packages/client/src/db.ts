/**
 * Type definitions for the Todo app
 * Re-exports types from api.ts for backward compatibility
 * 
 * Note: This app now uses a SQLite backend via REST API.
 * The actual data operations are handled by api.ts
 */

export type { Category, Todo } from './api';
