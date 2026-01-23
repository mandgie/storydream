import 'dotenv/config';
import { createWebSocketServer } from './websocket.js';
import { startApiServer } from './api.js';
import { cleanupAllSessions } from './container.js';

// Load .env from parent directory
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '../.env') });

const WS_PORT = parseInt(process.env.WS_PORT || '8080');
const API_PORT = parseInt(process.env.API_PORT || '8081');

console.log('Starting StoryDream backend...');

// Create WebSocket server for real-time communication
const wss = createWebSocketServer(WS_PORT);

// Start REST API server for project management
startApiServer(API_PORT);

// Handle graceful shutdown
async function shutdown() {
  console.log('Shutting down backend...');

  // Close WebSocket server
  wss.close();

  // Cleanup all sessions
  await cleanupAllSessions();

  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`Backend ready:`);
console.log(`  - WebSocket: ws://localhost:${WS_PORT}`);
console.log(`  - API: http://localhost:${API_PORT}`);
