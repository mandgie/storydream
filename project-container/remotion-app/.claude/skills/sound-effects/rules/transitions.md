# Transition Sound Effects

Whooshes, swooshes, and movement sounds for scene changes and animations.

## Available Sounds

### Whooshes
- `sfx/transitions/whoosh-fast.mp3` - Quick air swoosh (~0.3s)
- `sfx/transitions/whoosh-slow.mp3` - Slow sweeping whoosh (~0.8s)
- `sfx/transitions/whoosh-soft.mp3` - Gentle subtle whoosh (~0.4s)

### Swooshes
- `sfx/transitions/swoosh-high.mp3` - High-pitched swipe (~0.3s)
- `sfx/transitions/swoosh-low.mp3` - Low rumbling swipe (~0.4s)

### Directional
- `sfx/transitions/swipe-left.mp3` - Left swipe (~0.3s)
- `sfx/transitions/swipe-right.mp3` - Right swipe (~0.3s)
- `sfx/transitions/slide-in.mp3` - Smooth slide in (~0.4s)
- `sfx/transitions/slide-out.mp3` - Smooth slide out (~0.4s)

### Zoom
- `sfx/transitions/zoom-in.mp3` - Zoom intensifying (~0.5s)
- `sfx/transitions/zoom-out.mp3` - Zoom receding (~0.5s)

### Other
- `sfx/transitions/page-turn.mp3` - Paper turning (~0.4s)

## Usage Examples

### Basic Transition Sound

```tsx
import { Audio } from "@remotion/media";
import { staticFile, Sequence } from "remotion";

// Add whoosh when scene changes at frame 60
<Sequence name="Transition Whoosh" from={58} durationInFrames={15}>
  <Audio src={staticFile("sfx/transitions/whoosh-fast.mp3")} volume={0.6} />
</Sequence>
```

### Matching Direction to Animation

```tsx
// Element sliding in from left
<Sequence name="Slide In" from={0} durationInFrames={30}>
  <SlideInAnimation direction="left" />
  <Audio src={staticFile("sfx/transitions/swipe-left.mp3")} volume={0.5} />
</Sequence>
```

### Layered Transition

```tsx
// Combine swoosh with subtle boom for more impact
<Sequence name="Epic Transition" from={90} durationInFrames={30}>
  <Audio src={staticFile("sfx/transitions/swoosh-low.mp3")} volume={0.6} />
  <Audio src={staticFile("sfx/impacts/boom-subtle.mp3")} volume={0.3} />
</Sequence>
```

### Zoom Animation with Sound

```tsx
// Sync zoom sound with scale animation
const frame = useCurrentFrame();
const scale = interpolate(frame, [0, 20], [1, 1.5], { extrapolateRight: "clamp" });

<Sequence name="Zoom Effect" from={0} durationInFrames={25}>
  <div style={{ transform: `scale(${scale})` }}>{content}</div>
  <Audio src={staticFile("sfx/transitions/zoom-in.mp3")} volume={0.5} />
</Sequence>
```

## Timing Tips

1. **Start sound slightly early** - Human perception expects sound before visual
2. **Fast cuts = fast whoosh** - Match energy levels
3. **Volume 0.4-0.7** - Don't overpower other audio
4. **Peak alignment** - Sound peak should hit when transition is at maximum motion

## Recommended Combinations

| Visual Transition | Sound Recommendation |
|-------------------|----------------------|
| Quick cut | `whoosh-fast.mp3` |
| Slow fade/dissolve | `whoosh-soft.mp3` |
| Slide from side | `swipe-left.mp3` or `swipe-right.mp3` |
| Scale up reveal | `zoom-in.mp3` + `pop-bright.mp3` |
| Page flip | `page-turn.mp3` |
| Dramatic reveal | `swoosh-low.mp3` + `boom-subtle.mp3` |
