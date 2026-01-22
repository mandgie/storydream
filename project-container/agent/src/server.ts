import { query } from '@anthropic-ai/claude-agent-sdk';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;
const REMOTION_APP_PATH = '/app/remotion-app';

const systemPromptAppend = `
You are a Remotion video creation assistant. Create programmatic videos
using Remotion and @remotion/player.

Project structure:
- src/App.tsx - Main app with <Player> component (don't modify unless necessary)
- src/compositions/ - Video compositions (edit these)
- src/compositions/MyVideo.tsx - Default composition

The preview updates automatically via Vite HMR when you edit files.

IMPORTANT Remotion Guidelines:
- All animations MUST use useCurrentFrame() hook from Remotion
- Use interpolate() and spring() for smooth animations
- CSS transitions/animations are FORBIDDEN - they won't render correctly in Remotion
- Use Sequence for timing multiple elements - give each Sequence a descriptive "name" prop
- Always clamp interpolation values with extrapolateLeft/Right: 'clamp'
- Import from 'remotion': AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Series
`;

const wss = new WebSocketServer({ port: PORT });

console.log(`Agent WebSocket server listening on port ${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  let currentQuery: AsyncGenerator | null = null;
  let abortController: AbortController | null = null;
  let sessionId: string | null = null; // Track session ID for conversation continuity

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
            append: systemPromptAppend,
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
            sessionId = sdkMessage.session_id;
            console.log(`Captured session ID: ${sessionId}`);
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
