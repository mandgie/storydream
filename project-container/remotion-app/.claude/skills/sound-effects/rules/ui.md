# UI Sound Effects

Interface and notification sounds for feedback and interaction cues.

## Available Sounds

### Notifications
- `sfx/ui/notification-gentle.mp3` - Soft notification (~0.4s)
- `sfx/ui/notification-bright.mp3` - Bright alert tone (~0.3s)

### Status
- `sfx/ui/success.mp3` - Positive completion (~0.5s)
- `sfx/ui/error.mp3` - Error/warning tone (~0.4s)

### Toggles
- `sfx/ui/toggle-on.mp3` - Switch on sound (~0.2s)
- `sfx/ui/toggle-off.mp3` - Switch off sound (~0.2s)

### Typing
- `sfx/ui/typing-single.mp3` - Single keystroke (~0.1s)
- `sfx/ui/typing-burst.mp3` - Quick typing burst (~0.3s)

### Interaction
- `sfx/ui/hover.mp3` - Hover feedback (~0.1s)
- `sfx/ui/select.mp3` - Selection sound (~0.2s)
- `sfx/ui/expand.mp3` - Expanding element (~0.3s)
- `sfx/ui/collapse.mp3` - Collapsing element (~0.3s)

## Usage Examples

### Typewriter Effect

```tsx
import { Audio } from "@remotion/media";
import { staticFile, Sequence, useCurrentFrame } from "remotion";

// Typing sound for each character
const text = "Hello World";
const frame = useCurrentFrame();
const charsVisible = Math.floor(frame / 3); // New char every 3 frames

{text.slice(0, charsVisible).split('').map((char, i) => (
  <Sequence key={i} from={i * 3} durationInFrames={5}>
    <Audio src={staticFile("sfx/ui/typing-single.mp3")} volume={0.3} />
  </Sequence>
))}
```

### Success State

```tsx
// Checkmark animation with success sound
<Sequence name="Task Complete" from={60} durationInFrames={30}>
  <CheckmarkAnimation />
  <Audio src={staticFile("sfx/ui/success.mp3")} volume={0.6} />
</Sequence>
```

### Toggle Animation

```tsx
// Switch toggling on
<Sequence name="Feature Enabled" from={30} durationInFrames={15}>
  <ToggleAnimation state="on" />
  <Audio src={staticFile("sfx/ui/toggle-on.mp3")} volume={0.5} />
</Sequence>
```

### Notification Popup

```tsx
// Alert banner sliding in
<Sequence name="Notification" from={0} durationInFrames={20}>
  <NotificationBanner message="New message!" />
  <Audio src={staticFile("sfx/ui/notification-bright.mp3")} volume={0.5} />
</Sequence>
```

### Accordion Expand

```tsx
// Panel expanding
<Sequence name="Panel Expand" from={45} durationInFrames={25}>
  <ExpandingPanel />
  <Audio src={staticFile("sfx/ui/expand.mp3")} volume={0.4} />
</Sequence>
```

### Menu Selection

```tsx
// Highlighting menu items
<Sequence name="Menu Select" from={20} durationInFrames={10}>
  <MenuHighlight item={selectedItem} />
  <Audio src={staticFile("sfx/ui/select.mp3")} volume={0.4} />
</Sequence>
```

## Timing Tips

1. **Keep it subtle** - UI sounds should enhance, not distract
2. **Consistent volume** - Keep all UI sounds at similar levels (0.3-0.5)
3. **Quick response** - UI sounds should feel immediate
4. **Don't overuse** - Not every UI element needs a sound

## Recommended Use Cases

| UI Event | Sound Recommendation |
|----------|----------------------|
| Text typing | `typing-single.mp3` (per char) |
| Text block appears | `typing-burst.mp3` |
| Success/complete | `success.mp3` |
| Error/warning | `error.mp3` |
| Toggle on | `toggle-on.mp3` |
| Toggle off | `toggle-off.mp3` |
| Notification | `notification-gentle.mp3` |
| Important alert | `notification-bright.mp3` |
| Item selection | `select.mp3` |
| Panel open | `expand.mp3` |
| Panel close | `collapse.mp3` |
