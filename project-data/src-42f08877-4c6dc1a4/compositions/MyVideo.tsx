import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

// Animated letter component
const AnimatedLetter = ({
  letter,
  index,
  totalLetters,
  color = 'white',
  fontSize = 120,
}: {
  letter: string;
  index: number;
  totalLetters: number;
  color?: string;
  fontSize?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 5;

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  const rotation = interpolate(
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 15, stiffness: 180 },
    }),
    [0, 1],
    [360, 0]
  );

  const y = interpolate(
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 10, stiffness: 100 },
    }),
    [0, 1],
    [-100, 0]
  );

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight: 900,
        color,
        textShadow: '0 8px 30px rgba(0,0,0,0.4), 0 0 60px rgba(255,0,0,0.3)',
        transform: `scale(${scale}) rotate(${rotation}deg) translateY(${y}px)`,
        opacity,
        marginRight: letter === ' ' ? 30 : 5,
      }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </span>
  );
};

// GG Scene with dramatic entrance
const GGScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background pulse effect
  const pulse = Math.sin(frame * 0.1) * 0.1 + 1;

  // Glow intensity
  const glowIntensity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const letters = 'GG'.split('');

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center,
          hsl(${0 + Math.sin(frame * 0.05) * 10}, 70%, 25%) 0%,
          hsl(${350 + Math.sin(frame * 0.03) * 10}, 80%, 10%) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'SF Pro Display', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles */}
      {[...Array(12)].map((_, i) => {
        const particleX = Math.sin(frame * 0.02 + i * 1.5) * 300;
        const particleY = Math.cos(frame * 0.015 + i * 2) * 200;
        const size = 100 + Math.sin(frame * 0.05 + i) * 50;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle,
                hsla(${0 + i * 10}, 100%, 70%, 0.15) 0%,
                transparent 70%)`,
              transform: `translate(${particleX}px, ${particleY}px)`,
              filter: 'blur(20px)',
            }}
          />
        );
      })}

      {/* Main GG text */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pulse})`,
          filter: `drop-shadow(0 0 ${60 * glowIntensity}px rgba(220, 38, 38, 0.8))`,
        }}
      >
        {letters.map((letter, index) => (
          <AnimatedLetter
            key={index}
            letter={letter}
            index={index}
            totalLetters={letters.length}
            color="#ffffff"
            fontSize={200}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Subtitle reveal scene
const SubtitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "Your new best friend";
  const letters = text.split('');

  // Wave animation for each letter
  const getLetterStyle = (index: number) => {
    const delay = index * 2;

    const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const y = interpolate(
      spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 150 },
      }),
      [0, 1],
      [30, 0]
    );

    // Gentle wave after entrance
    const wave = frame > delay + 15
      ? Math.sin((frame - delay) * 0.15) * 3
      : 0;

    return {
      display: 'inline-block',
      opacity,
      transform: `translateY(${y + wave}px)`,
      marginRight: letters[index] === ' ' ? 15 : 2,
    };
  };

  return (
    <AbsoluteFill
      style={{
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 200,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: 'white',
          fontFamily: "'SF Pro Display', system-ui, sans-serif",
          letterSpacing: '0.02em',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {letters.map((letter, index) => (
          <span key={index} style={getLetterStyle(index)}>
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// GG Pop and Rain Scene
const GGPopRainScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Pop animation timing
  const popFrame = 20;
  const hasPopped = frame >= popFrame;

  // GG scale before pop - builds up then explodes
  const ggScale = interpolate(
    frame,
    [0, popFrame - 5, popFrame],
    [1, 1.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Pop particles
  const numParticles = 20;
  const particles = [...Array(numParticles)].map((_, i) => {
    const angle = (i / numParticles) * Math.PI * 2;
    const speed = 8 + (i % 3) * 4;
    const particleProgress = interpolate(
      frame - popFrame,
      [0, 30],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const x = Math.cos(angle) * speed * particleProgress * 30;
    const y = Math.sin(angle) * speed * particleProgress * 30 + particleProgress * particleProgress * 100;
    const opacity = interpolate(particleProgress, [0, 0.3, 1], [1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const size = 20 + (i % 4) * 10;

    return { x, y, opacity, size, angle };
  });

  // Rain drops
  const numRainDrops = 60;
  const rainDrops = [...Array(numRainDrops)].map((_, i) => {
    const startX = ((i * 37) % 100); // Distributed across width
    const startDelay = ((i * 7) % 30); // Staggered start
    const rainStart = popFrame + 10 + startDelay;
    const speed = 15 + (i % 5) * 3;

    const rainProgress = interpolate(
      frame - rainStart,
      [0, 60],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Loop the rain by using modulo
    const loopedProgress = ((frame - rainStart) % 40) / 40;
    const isVisible = frame >= rainStart;

    const y = isVisible ? -50 + loopedProgress * (height + 100) : -100;
    const x = startX + Math.sin((frame + i * 10) * 0.05) * 5; // Slight sway
    const opacity = isVisible ? interpolate(loopedProgress, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) : 0;

    return { x, y, opacity, speed };
  });

  // Fade in rain intensity
  const rainOpacity = interpolate(
    frame - popFrame - 10,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg,
          hsl(0, 40%, 15%) 0%,
          hsl(350, 50%, 10%) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* GG text that pops */}
      {!hasPopped && (
        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
            textShadow: '0 0 60px rgba(220, 38, 38, 0.8)',
            transform: `scale(${ggScale})`,
          }}
        >
          GG
        </div>
      )}

      {/* Pop particles */}
      {hasPopped && particles.map((particle, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: `radial-gradient(circle,
              hsla(${0 + i * 5}, 100%, 70%, ${particle.opacity}) 0%,
              hsla(${350 + i * 5}, 80%, 50%, ${particle.opacity * 0.5}) 100%)`,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            boxShadow: `0 0 20px hsla(${0 + i * 5}, 100%, 70%, ${particle.opacity * 0.5})`,
          }}
        />
      ))}

      {/* Rain drops */}
      <div style={{ opacity: rainOpacity }}>
        {rainDrops.map((drop, i) => (
          <div
            key={`rain-${i}`}
            style={{
              position: 'absolute',
              left: `${drop.x}%`,
              top: drop.y,
              width: 3,
              height: 20 + (i % 3) * 10,
              borderRadius: 2,
              background: `linear-gradient(180deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, ${drop.opacity}) 30%,
                rgba(255, 200, 200, ${drop.opacity}) 100%)`,
              boxShadow: `0 0 10px rgba(255, 200, 200, ${drop.opacity * 0.3})`,
            }}
          />
        ))}
      </div>

      {/* "POP!" text that appears briefly */}
      {hasPopped && frame < popFrame + 25 && (
        <div
          style={{
            position: 'absolute',
            fontSize: interpolate(frame - popFrame, [0, 10], [50, 120], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            fontWeight: 900,
            color: '#fbbf24',
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
            textShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
            opacity: interpolate(frame - popFrame, [0, 5, 20, 25], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `scale(${interpolate(frame - popFrame, [0, 10], [0.5, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })})`,
          }}
        >
          POP!
        </div>
      )}
    </AbsoluteFill>
  );
};

// Learn More Scene
const LearnMoreScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "Want to learn more?";
  const letters = text.split('');

  // Fade in the background
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Text entrance with bounce
  const textScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });

  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulsing glow effect
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  // Floating particles
  const particles = [...Array(15)].map((_, i) => {
    const baseX = (i / 15) * 100;
    const floatY = Math.sin(frame * 0.03 + i * 2) * 30;
    const floatX = Math.cos(frame * 0.02 + i * 1.5) * 20;
    const particleOpacity = interpolate(frame, [0, 30], [0, 0.6], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return { x: baseX + floatX, y: 50 + floatY, opacity: particleOpacity * (0.3 + Math.sin(frame * 0.05 + i) * 0.2) };
  });

  // Animated underline
  const underlineWidth = interpolate(frame, [30, 50], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center,
          hsl(0, 60%, 18%) 0%,
          hsl(350, 70%, 8%) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'SF Pro Display', system-ui, sans-serif",
        overflow: 'hidden',
        opacity: bgOpacity,
      }}
    >
      {/* Floating particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: 8 + (i % 3) * 4,
            height: 8 + (i % 3) * 4,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255, 255, 255, ${particle.opacity}) 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Main text */}
      <div
        style={{
          transform: `scale(${textScale})`,
          opacity: textOpacity,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            textShadow: `0 0 ${40 * glowPulse}px rgba(220, 38, 38, 0.8), 0 4px 20px rgba(0,0,0,0.5)`,
            letterSpacing: '0.02em',
          }}
        >
          {text}
        </div>

        {/* Animated underline */}
        <div
          style={{
            width: `${underlineWidth}%`,
            height: 4,
            background: 'linear-gradient(90deg, transparent 0%, #dc2626 20%, #ffffff 50%, #dc2626 80%, transparent 100%)',
            margin: '20px auto 0',
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
          }}
        />
      </div>

      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          borderLeft: '3px solid rgba(255,255,255,0.5)',
          borderTop: '3px solid rgba(255,255,255,0.5)',
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          borderRight: '3px solid rgba(255,255,255,0.5)',
          borderBottom: '3px solid rgba(255,255,255,0.5)',
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  );
};

// Final combined scene with effects
const FinalScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sparkle/shine effect
  const shine = interpolate(frame, [0, 30, 60], [0, 1, 0.7], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center,
          hsl(0, 70%, 20%) 0%,
          hsl(350, 80%, 8%) 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Animated shine lines */}
      {[...Array(6)].map((_, i) => {
        const lineProgress = interpolate(
          frame - i * 8,
          [0, 40],
          [-100, 200],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '200%',
              height: 2,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(255,255,255,${0.3 - i * 0.04}) 50%,
                transparent 100%)`,
              transform: `rotate(${-45 + i * 15}deg) translateX(${lineProgress}%)`,
              top: '50%',
              left: '-50%',
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center,
            rgba(220, 38, 38, ${0.3 * shine}) 0%,
            transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      {/* Background layer */}
      <Sequence name="Background Effects" from={0} durationInFrames={150}>
        <FinalScene />
      </Sequence>

      {/* GG entrance - starts immediately */}
      <Sequence name="GG Title" from={0} durationInFrames={150} layout="none">
        <GGScene />
      </Sequence>

      {/* Subtitle appears after GG settles */}
      <Sequence name="Subtitle Reveal" from={40} durationInFrames={110} layout="none">
        <SubtitleScene />
      </Sequence>

      {/* GG Pop and Rain scene */}
      <Sequence name="GG Pop and Rain" from={150} durationInFrames={120}>
        <GGPopRainScene />
      </Sequence>

      {/* Learn More scene */}
      <Sequence name="Learn More" from={270} durationInFrames={90}>
        <LearnMoreScene />
      </Sequence>
    </AbsoluteFill>
  );
};
