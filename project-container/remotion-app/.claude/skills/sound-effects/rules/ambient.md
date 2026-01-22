# Ambient Sound Effects

Background and atmospheric sounds for setting mood and environment.

## Available Sounds

### Nature
- `sfx/ambient/nature-birds.mp3` - Birds chirping (~10s, loopable)
- `sfx/ambient/nature-wind.mp3` - Gentle wind (~10s, loopable)
- `sfx/ambient/rain-light.mp3` - Light rain (~10s, loopable)
- `sfx/ambient/rain-heavy.mp3` - Heavy rain (~10s, loopable)

### Urban
- `sfx/ambient/office-hum.mp3` - Office background (~10s, loopable)
- `sfx/ambient/city-traffic.mp3` - Urban traffic (~10s, loopable)
- `sfx/ambient/cafe-chatter.mp3` - Coffee shop ambiance (~10s, loopable)
- `sfx/ambient/crowd-small.mp3` - Small crowd murmur (~10s, loopable)

### Tech/Abstract
- `sfx/ambient/tech-hum.mp3` - Digital/tech ambiance (~10s, loopable)
- `sfx/ambient/space-drone.mp3` - Sci-fi space atmosphere (~10s, loopable)

## Usage Examples

### Looping Background Ambient

```tsx
import { Audio } from "@remotion/media";
import { staticFile, Sequence } from "remotion";

// Loop office ambiance throughout video
<Sequence name="Background Ambiance" from={0} durationInFrames={450}>
  <Audio
    src={staticFile("sfx/ambient/office-hum.mp3")}
    volume={0.2}
    loop
    loopVolumeCurveBehavior="extend"
  />
</Sequence>
```

### Fade In Ambient

```tsx
// Gradually introduce ambient sound
<Sequence name="Ambient Fade In" from={0} durationInFrames={300}>
  <Audio
    src={staticFile("sfx/ambient/nature-birds.mp3")}
    volume={(f) => interpolate(f, [0, 30], [0, 0.25], { extrapolateRight: "clamp" })}
    loop
  />
</Sequence>
```

### Scene-Specific Atmosphere

```tsx
// Different ambient for different scenes
<>
  {/* Indoor office scene */}
  <Sequence name="Office Scene" from={0} durationInFrames={150}>
    <OfficeVisuals />
    <Audio src={staticFile("sfx/ambient/office-hum.mp3")} volume={0.2} loop />
  </Sequence>

  {/* Outdoor nature scene */}
  <Sequence name="Nature Scene" from={150} durationInFrames={150}>
    <NatureVisuals />
    <Audio src={staticFile("sfx/ambient/nature-birds.mp3")} volume={0.25} loop />
  </Sequence>
</>
```

### Crossfade Between Ambients

```tsx
const frame = useCurrentFrame();
const transitionFrame = 150;

// Fade out first ambient
<Sequence name="City Ambient" from={0} durationInFrames={180}>
  <Audio
    src={staticFile("sfx/ambient/city-traffic.mp3")}
    volume={(f) => {
      if (f < transitionFrame - 30) return 0.2;
      return interpolate(f, [transitionFrame - 30, transitionFrame], [0.2, 0], { extrapolateRight: "clamp" });
    }}
    loop
  />
</Sequence>

// Fade in second ambient
<Sequence name="Cafe Ambient" from={transitionFrame - 30} durationInFrames={180}>
  <Audio
    src={staticFile("sfx/ambient/cafe-chatter.mp3")}
    volume={(f) => interpolate(f, [0, 30], [0, 0.2], { extrapolateRight: "clamp" })}
    loop
  />
</Sequence>
```

### Rain for Mood

```tsx
// Add rain for reflective/calm mood
<Sequence name="Rain Atmosphere" from={0} durationInFrames={300}>
  <Audio src={staticFile("sfx/ambient/rain-light.mp3")} volume={0.3} loop />
</Sequence>
```

## Timing Tips

1. **Keep volume low** - Ambient should be barely noticeable (0.1-0.3)
2. **Use loop** - All ambient sounds are designed to loop seamlessly
3. **Fade transitions** - Always crossfade between different ambients
4. **Match mood** - Choose ambient that supports the visual tone
5. **Layer carefully** - Can combine ambient with music, but reduce volumes

## Recommended Use Cases

| Video Type | Sound Recommendation |
|------------|----------------------|
| Corporate/business | `office-hum.mp3` |
| Outdoor/wellness | `nature-birds.mp3` or `nature-wind.mp3` |
| Urban/city content | `city-traffic.mp3` |
| Social/lifestyle | `cafe-chatter.mp3` |
| Tech/innovation | `tech-hum.mp3` |
| Futuristic/sci-fi | `space-drone.mp3` |
| Calm/reflective | `rain-light.mp3` |
| Dramatic/intense | `rain-heavy.mp3` |
| Event/presentation | `crowd-small.mp3` |

## Volume Guidelines

| Context | Recommended Volume |
|---------|-------------------|
| Solo ambient (no other audio) | 0.2 - 0.3 |
| With background music | 0.1 - 0.15 |
| With voiceover | 0.05 - 0.1 |
| Ambient as primary mood | 0.25 - 0.35 |
