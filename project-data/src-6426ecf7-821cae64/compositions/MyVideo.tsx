import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence, spring } from 'remotion';

const TerminalFlip = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "Hello world";
  const prompt = "$ ";

  // Calculate how many characters to show based on frame
  const typingDelay = fps * 0.5;
  const framesPerChar = 4;

  const typingFrame = Math.max(0, frame - typingDelay);
  const charsToShow = Math.min(
    Math.floor(typingFrame / framesPerChar),
    text.length
  );

  const displayedText = text.slice(0, charsToShow);

  // Blinking cursor
  const cursorVisible = Math.floor(frame / (fps / 2)) % 2 === 0;
  const showCursor = charsToShow < text.length || cursorVisible;

  // Terminal window fade in
  const terminalOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const terminalScale = interpolate(frame, [0, fps * 0.3], [0.95, 1], {
    extrapolateRight: 'clamp',
  });

  // Initial subtle 3D movement (first 90 frames)
  const initialRotateY = interpolate(
    frame,
    [0, 45, 90],
    [-8, 8, 0],
    { extrapolateRight: 'clamp' }
  );

  const initialRotateX = interpolate(
    frame,
    [0, 45, 90],
    [5, -5, 0],
    { extrapolateRight: 'clamp' }
  );

  // Flip animation starts at frame 90
  const flipStartFrame = 90;
  const flipProgress = spring({
    frame: frame - flipStartFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
      mass: 1,
    },
  });

  // Full 180 degree flip on X axis (flips forward/backward)
  const flipRotateX = frame < flipStartFrame
    ? initialRotateX
    : interpolate(flipProgress, [0, 1], [0, 180]);

  const flipRotateY = frame < flipStartFrame ? initialRotateY : 0;

  // Hide terminal when it's facing away (past 90 degrees)
  const terminalVisible = flipRotateX < 90;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        perspective: 1200,
      }}
    >
      {/* Container for 3D transform */}
      <div
        style={{
          position: 'relative',
          width: 700,
          height: 400,
          transformStyle: 'preserve-3d',
          transform: `scale(${terminalScale}) rotateX(${flipRotateX}deg) rotateY(${flipRotateY}deg)`,
        }}
      >
        {/* Terminal (front face) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#0d1117',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            opacity: terminalVisible ? terminalOpacity : 0,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              height: 36,
              backgroundColor: '#161b22',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              gap: 8,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27ca40' }} />
            <span style={{ marginLeft: 'auto', marginRight: 'auto', color: '#8b949e', fontSize: 13 }}>
              Terminal
            </span>
          </div>

          {/* Terminal content */}
          <div
            style={{
              padding: 24,
              color: '#c9d1d9',
              fontSize: 24,
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: '#7ee787' }}>{prompt}</span>
            <span>{displayedText}</span>
            <span
              style={{
                backgroundColor: showCursor ? '#c9d1d9' : 'transparent',
                marginLeft: 2,
              }}
            >
              &nbsp;
            </span>
          </div>
        </div>

        {/* Back face with "Let us introduce Saltfish" text */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RevealText frame={frame} flipStartFrame={flipStartFrame} fps={fps} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RevealText = ({ frame, flipStartFrame, fps }: { frame: number; flipStartFrame: number; fps: number }) => {
  // Text reveal animation starts after flip begins
  const revealDelay = flipStartFrame + fps * 0.3;

  const textOpacity = interpolate(
    frame,
    [revealDelay, revealDelay + fps * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Bend up effect - text curves upward using multiple spans
  const words = "Let us introduce Saltfish".split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: textOpacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          perspective: 800,
        }}
      >
        {words.map((word, index) => {
          // Staggered animation for each word
          const wordDelay = revealDelay + index * 4;

          const wordProgress = spring({
            frame: frame - wordDelay,
            fps,
            config: {
              damping: 12,
              stiffness: 100,
              mass: 0.8,
            },
          });

          // Each word bends up from the bottom
          const rotateX = interpolate(wordProgress, [0, 1], [45, 0]);
          const translateY = interpolate(wordProgress, [0, 1], [30, 0]);
          const wordOpacity = interpolate(wordProgress, [0, 0.3], [0, 1], {
            extrapolateRight: 'clamp',
          });

          // Highlight "Saltfish" differently
          const isSaltfish = word === 'Saltfish';

          return (
            <span
              key={index}
              style={{
                fontSize: isSaltfish ? 64 : 48,
                fontWeight: isSaltfish ? 800 : 600,
                color: isSaltfish ? '#00d9ff' : '#ffffff',
                textShadow: isSaltfish
                  ? '0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.4)'
                  : '0 4px 20px rgba(0,0,0,0.5)',
                transform: `rotateX(${rotateX}deg) translateY(${translateY}px)`,
                transformOrigin: 'bottom center',
                opacity: wordOpacity,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Terminal Flip Reveal" from={0} durationInFrames={180}>
        <TerminalFlip />
      </Sequence>
    </AbsoluteFill>
  );
};
