# Impact Sound Effects

Clicks, pops, hits, and emphasis sounds for adding weight and attention.

## Available Sounds

### Clicks
- `sfx/impacts/click-soft.mp3` - Gentle click (~0.1s)
- `sfx/impacts/click-hard.mp3` - Sharp decisive click (~0.1s)

### Pops
- `sfx/impacts/pop-bright.mp3` - Bright popping sound (~0.2s)
- `sfx/impacts/pop-deep.mp3` - Deep bass pop (~0.2s)

### Thuds
- `sfx/impacts/thud-heavy.mp3` - Heavy impact thud (~0.4s)
- `sfx/impacts/thud-soft.mp3` - Muffled thud (~0.3s)

### Hits
- `sfx/impacts/snap.mp3` - Finger snap (~0.1s)
- `sfx/impacts/hit-punch.mp3` - Punchy impact (~0.2s)
- `sfx/impacts/hit-slap.mp3` - Slap/clap sound (~0.2s)

### Booms
- `sfx/impacts/boom-cinematic.mp3` - Cinematic boom (~1.0s)
- `sfx/impacts/boom-subtle.mp3` - Subtle low boom (~0.6s)

### Metallic
- `sfx/impacts/glass-tap.mp3` - Glass tapping (~0.2s)
- `sfx/impacts/metal-ping.mp3` - Metallic ping (~0.3s)

## Usage Examples

### Element Appearing with Pop

```tsx
import { Audio } from "@remotion/media";
import { staticFile, Sequence } from "remotion";

// Pop sound when element scales in
<Sequence name="Element Appear" from={0} durationInFrames={20}>
  <ScaleInAnimation />
  <Audio src={staticFile("sfx/impacts/pop-bright.mp3")} volume={0.5} />
</Sequence>
```

### Text Emphasis

```tsx
// Add punch to important text reveal
<Sequence name="Headline Impact" from={30} durationInFrames={25}>
  <h1 style={headlineStyle}>BIG ANNOUNCEMENT</h1>
  <Audio src={staticFile("sfx/impacts/hit-punch.mp3")} volume={0.6} />
</Sequence>
```

### Cinematic Reveal

```tsx
// Dramatic logo reveal with boom
<Sequence name="Logo Reveal" from={60} durationInFrames={45}>
  <LogoAnimation />
  <Audio src={staticFile("sfx/impacts/boom-cinematic.mp3")} volume={0.7} />
</Sequence>
```

### Multiple Items Appearing

```tsx
// Stagger pops for list items
{items.map((item, i) => (
  <Sequence key={i} name={`Item ${i + 1}`} from={i * 10} durationInFrames={15}>
    <ListItem>{item}</ListItem>
    <Audio src={staticFile("sfx/impacts/pop-bright.mp3")} volume={0.4} />
  </Sequence>
))}
```

### Button/UI Interaction

```tsx
// Click sound for button press animation
<Sequence name="Button Press" from={45} durationInFrames={10}>
  <ButtonPressAnimation />
  <Audio src={staticFile("sfx/impacts/click-soft.mp3")} volume={0.5} />
</Sequence>
```

## Timing Tips

1. **Precise alignment** - Impact sounds must hit exactly on the visual moment
2. **Use shorter sounds for speed** - Quick animations need quick sounds
3. **Layer for power** - Combine boom with click for weighted impacts
4. **Volume variation** - Vary volume for staggered elements (first loud, rest softer)

## Recommended Use Cases

| Visual Event | Sound Recommendation |
|--------------|----------------------|
| Element pops in | `pop-bright.mp3` |
| Heavy object lands | `thud-heavy.mp3` |
| Button click | `click-soft.mp3` |
| Important reveal | `boom-cinematic.mp3` |
| Quick snap change | `snap.mp3` |
| UI selection | `glass-tap.mp3` |
| Achievement/badge | `metal-ping.mp3` |
| Action emphasis | `hit-punch.mp3` |
