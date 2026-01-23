import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

// Intro Scene Component
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: 'white',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          margin: 0,
        }}
      >
        Welcome to StoryDream
      </h1>
    </AbsoluteFill>
  );
};

// Main Content Scene
const MainScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <p
        style={{
          fontSize: 48,
          color: 'white',
          opacity,
          textAlign: 'center',
          maxWidth: '80%',
        }}
      >
        Create stunning videos with the power of AI
      </p>
    </AbsoluteFill>
  );
};

// Outro Scene
const OutroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: 'white',
          transform: `scale(${scale})`,
        }}
      >
        Get Started Today
      </h2>
    </AbsoluteFill>
  );
};

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Intro - 0 to 50 frames */}
      <Sequence name="Intro" from={0} durationInFrames={50}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Main Content - 50 to 100 frames */}
      <Sequence name="Main Content" from={50} durationInFrames={50}>
        <MainScene />
      </Sequence>

      {/* Scene 3: Outro - 100 to 150 frames */}
      <Sequence name="Outro" from={100} durationInFrames={50}>
        <OutroScene />
      </Sequence>

      {/* Text overlay that spans multiple scenes */}
      <Sequence name="Subtitle Text" from={20} durationInFrames={60} layout="none">
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 }}>
          <p style={{ fontSize: 24, color: 'rgba(255,255,255,0.8)', fontFamily: 'system-ui' }}>
            AI-Powered Video Creation
          </p>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
