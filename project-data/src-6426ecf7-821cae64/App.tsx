import { useRef, useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { MyVideo } from './compositions/MyVideo';
import { Timeline } from './components/Timeline';

const DURATION_IN_FRAMES = 150;
const FPS = 30;

// Post error to parent window (frontend) for auto-fixing
function postErrorToParent(error: { message: string; stack?: string; componentStack?: string }) {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'remotion:error',
      error: {
        message: error.message,
        stack: error.stack,
        componentStack: error.componentStack,
      },
    }, '*');
  }
}

// Error Boundary to catch React component errors
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('React Error Boundary caught error:', error);
    postErrorToParent({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 20,
          color: '#ff6b6b',
          background: '#1a1a1a',
          fontFamily: 'monospace',
          fontSize: 14,
        }}>
          <h2>Component Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error?.message}
          </pre>
          <p style={{ color: '#888', marginTop: 10 }}>
            Error sent to agent for automatic fixing...
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Global error handlers for unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      postErrorToParent({
        message: event.message,
        stack: event.error?.stack,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);
      postErrorToParent({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Sync current frame from player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    let animationId: number;
    const sync = () => {
      setCurrentFrame(player.getCurrentFrame());
      animationId = requestAnimationFrame(sync);
    };
    sync();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleSeek = useCallback((frame: number) => {
    playerRef.current?.seekTo(frame);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D0D0D',
        padding: '12px',
        boxSizing: 'border-box',
        gap: '12px',
      }}
    >
      {/* Video Player */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <ErrorBoundary>
          <Player
            ref={playerRef}
            component={MyVideo}
            compositionWidth={1920}
            compositionHeight={1080}
            durationInFrames={DURATION_IN_FRAMES}
            fps={FPS}
            style={{
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: '16/9',
            }}
            controls
            autoPlay
            loop
          />
        </ErrorBoundary>
      </div>

      {/* Timeline */}
      <Timeline
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        currentFrame={currentFrame}
        onSeek={handleSeek}
      />
    </div>
  );
};
