# Musical Sound Effects

Stingers, risers, and musical accents for dramatic moments and branding.

## Available Sounds

### Stingers
- `sfx/musical/stinger-positive.mp3` - Uplifting stinger (~1.5s)
- `sfx/musical/stinger-dramatic.mp3` - Dramatic stinger (~2.0s)
- `sfx/musical/stinger-tech.mp3` - Tech/modern stinger (~1.5s)
- `sfx/musical/stinger-corporate.mp3` - Professional stinger (~1.5s)

### Risers
- `sfx/musical/riser-tension.mp3` - Building tension (~3.0s)
- `sfx/musical/riser-bright.mp3` - Upward bright riser (~2.0s)

### Drops & Impacts
- `sfx/musical/drop-impact.mp3` - Bass drop impact (~1.0s)

### Accents
- `sfx/musical/ding-success.mp3` - Musical success ding (~0.5s)
- `sfx/musical/fanfare-short.mp3` - Brief fanfare (~2.0s)
- `sfx/musical/countdown-tick.mp3` - Single countdown tick (~0.3s)

### Branding
- `sfx/musical/logo-reveal.mp3` - Logo reveal sound (~2.5s)
- `sfx/musical/outro-fade.mp3` - Ending fade tone (~3.0s)

## Usage Examples

### Logo Reveal

```tsx
import { Audio } from "@remotion/media";
import { staticFile, Sequence } from "remotion";

// Logo animation with reveal sound
<Sequence name="Logo Reveal" from={0} durationInFrames={90}>
  <LogoAnimation />
  <Audio src={staticFile("sfx/musical/logo-reveal.mp3")} volume={0.7} />
</Sequence>
```

### Riser to Drop

```tsx
// Build tension then release
<>
  {/* Tension building */}
  <Sequence name="Build Up" from={60} durationInFrames={90}>
    <BuildUpVisuals />
    <Audio src={staticFile("sfx/musical/riser-tension.mp3")} volume={0.6} />
  </Sequence>

  {/* The reveal with impact */}
  <Sequence name="The Reveal" from={150} durationInFrames={45}>
    <BigRevealAnimation />
    <Audio src={staticFile("sfx/musical/drop-impact.mp3")} volume={0.8} />
  </Sequence>
</>
```

### Countdown Timer

```tsx
// Tick sound for each second of countdown
const countdownStart = 5; // 5 second countdown
const fps = 30;

{Array.from({ length: countdownStart }).map((_, i) => (
  <Sequence key={i} name={`Tick ${countdownStart - i}`} from={i * fps} durationInFrames={fps}>
    <CountdownNumber value={countdownStart - i} />
    <Audio src={staticFile("sfx/musical/countdown-tick.mp3")} volume={0.5} />
  </Sequence>
))}

{/* Final moment with fanfare */}
<Sequence name="Countdown Complete" from={countdownStart * fps} durationInFrames={60}>
  <CelebrationAnimation />
  <Audio src={staticFile("sfx/musical/fanfare-short.mp3")} volume={0.7} />
</Sequence>
```

### Section Stingers

```tsx
// Different stingers for different content types
<>
  {/* Tech product reveal */}
  <Sequence name="Product Reveal" from={0} durationInFrames={60}>
    <ProductAnimation />
    <Audio src={staticFile("sfx/musical/stinger-tech.mp3")} volume={0.6} />
  </Sequence>

  {/* Success/achievement moment */}
  <Sequence name="Achievement" from={120} durationInFrames={45}>
    <AchievementBadge />
    <Audio src={staticFile("sfx/musical/stinger-positive.mp3")} volume={0.6} />
  </Sequence>
</>
```

### Video Outro

```tsx
// Fade out with outro tone
const { durationInFrames } = useVideoConfig();
const outroStart = durationInFrames - 90; // Last 3 seconds

<Sequence name="Outro" from={outroStart} durationInFrames={90}>
  <OutroAnimation />
  <Audio src={staticFile("sfx/musical/outro-fade.mp3")} volume={0.5} />
</Sequence>
```

### Success Moment

```tsx
// Achievement/completion ding
<Sequence name="Success" from={60} durationInFrames={30}>
  <SuccessAnimation />
  <Audio src={staticFile("sfx/musical/ding-success.mp3")} volume={0.6} />
</Sequence>
```

## Timing Tips

1. **Match visual peak** - Stinger peak should align with visual climax
2. **Riser = anticipation** - Use risers before important reveals
3. **Don't stack** - Only one stinger/musical element at a time
4. **Volume balance** - Musical elements can be louder (0.5-0.8)
5. **End on resolved note** - Use outro-fade for satisfying endings

## Recommended Use Cases

| Moment | Sound Recommendation |
|--------|----------------------|
| Logo/brand intro | `logo-reveal.mp3` |
| Video ending | `outro-fade.mp3` |
| Achievement/win | `stinger-positive.mp3` + `ding-success.mp3` |
| Big reveal | `riser-tension.mp3` → `drop-impact.mp3` |
| Product launch | `stinger-tech.mp3` |
| Corporate highlight | `stinger-corporate.mp3` |
| Dramatic moment | `stinger-dramatic.mp3` |
| Celebration | `fanfare-short.mp3` |
| Countdown | `countdown-tick.mp3` (each tick) |
| Positive transition | `riser-bright.mp3` |

## Combining with Other Audio

Musical elements work best as focal points. When using:

| Scenario | Musical Volume | Other Audio |
|----------|----------------|-------------|
| With background music | 0.6 - 0.7 | Duck music to 0.2 |
| With voiceover | 0.4 - 0.5 | Voice at 1.0, pause VO during stinger |
| With ambient | 0.6 - 0.8 | Ambient at 0.1 |
| Solo (no other audio) | 0.7 - 0.9 | N/A |
