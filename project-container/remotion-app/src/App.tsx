import { useRef, useState, useEffect, useCallback } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { MyVideo } from './compositions/MyVideo';
import { Timeline } from './components/Timeline';

const DURATION_IN_FRAMES = 150;
const FPS = 30;

export const App = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

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
