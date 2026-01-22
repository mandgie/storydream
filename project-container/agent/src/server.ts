import { query } from '@anthropic-ai/claude-agent-sdk';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;
const REMOTION_APP_PATH = '/app/remotion-app';

// Read initial session ID from environment (for session persistence across container restarts)
const INITIAL_SESSION_ID = process.env.AGENT_SESSION_ID || null;

const wss = new WebSocketServer({ port: PORT });

console.log(`Agent WebSocket server listening on port ${PORT}`);
if (INITIAL_SESSION_ID) {
  console.log(`Will resume agent session: ${INITIAL_SESSION_ID}`);
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  let currentQuery: AsyncGenerator | null = null;
  let abortController: AbortController | null = null;
  // Initialize with session ID from environment if available (for persistence)
  let sessionId: string | null = INITIAL_SESSION_ID;

  ws.on('message', async (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'prompt') {
        // Cancel any existing query
        if (abortController) {
          abortController.abort();
        }

        abortController = new AbortController();

        console.log('Received prompt:', message.content);
        console.log('Starting Claude query...', sessionId ? `(resuming session ${sessionId})` : '(new session)');

        // Build query options - use resume if we have a session ID
        const queryOptions: any = {
          model: 'claude-opus-4-5-20251101',
          cwd: REMOTION_APP_PATH,
          abortController,
          // Always bypass permissions (safe since agent runs in sandboxed container)
          permissionMode: 'bypassPermissions',
          allowDangerouslySkipPermissions: true,
        };

        // Only set systemPrompt and other init options for new sessions
        if (!sessionId) {
          queryOptions.systemPrompt = {
            type: 'preset',
            preset: 'claude_code',
          };
          queryOptions.settingSources = ['project'];
        } else {
          // Resume existing session to maintain conversation context
          queryOptions.resume = sessionId;
        }

        currentQuery = query({
          prompt: message.content,
          options: queryOptions,
        });

        // Stream messages back to client
        console.log('Starting to stream messages...');
        let messageCount = 0;
        for await (const sdkMessage of currentQuery) {
          messageCount++;
          console.log(`Message ${messageCount}:`, sdkMessage.type, JSON.stringify(sdkMessage).substring(0, 500));

          // Capture session ID from system init message for conversation continuity
          if (sdkMessage.type === 'system' && sdkMessage.subtype === 'init' && sdkMessage.session_id) {
            const newSessionId = sdkMessage.session_id;
            // Only notify backend if this is a new session (not resuming)
            if (newSessionId !== sessionId) {
              sessionId = newSessionId;
              console.log(`Captured new session ID: ${sessionId}`);
              // Notify backend of the new session ID for persistence
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'session_id',
                  sessionId: sessionId,
                }));
              }
            } else {
              console.log(`Resumed existing session: ${sessionId}`);
            }
          }

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'agent_message',
              data: sdkMessage,
            }));
          } else {
            console.log('WebSocket not open, state:', ws.readyState);
          }
        }
        console.log(`Stream completed with ${messageCount} messages`);

        // Signal completion
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'complete' }));
          console.log('Sent complete signal');
        }

      } else if (message.type === 'cancel') {
        if (abortController) {
          abortController.abort();
          console.log('Query cancelled');
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (abortController) {
      abortController.abort();
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down agent server...');
  wss.close(() => {
    process.exit(0);
  });
});
