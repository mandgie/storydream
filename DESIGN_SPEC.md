# StoryDream Video Player - Design Specification

This document defines the visual language and design system for the StoryDream Remotion video player interface.

---

## 1. Overall Aesthetic

**Style**: Cinematic, professional, immersive video editing interface
**Theme**: Dark mode with warm accent colors
**Approach**: Glassmorphism with floating UI elements over full-bleed video content

The interface prioritizes the video content by using it as the primary visual element, with semi-transparent UI controls floating above. This creates an immersive editing experience.

---

## 2. Color Palette

### Background Colors
```css
--bg-primary: #0D0D0D;           /* Near black - main background */
--bg-secondary: #1A1A1A;         /* Dark gray - secondary surfaces */
--bg-elevated: rgba(30, 25, 22, 0.85); /* Warm dark - floating panels */
```

### Glass/Overlay Colors
```css
--glass-bg: rgba(40, 35, 32, 0.75);      /* Frosted glass background */
--glass-border: rgba(255, 255, 255, 0.1); /* Subtle white border */
--glass-highlight: rgba(255, 255, 255, 0.05); /* Inner highlight */
```

### Accent Colors
```css
--accent-warm: #C4856C;          /* Warm terracotta/coral */
--accent-gold: #D4A574;          /* Golden bronze */
--accent-red: #B85450;           /* Deep warm red */
--accent-white: #FFFFFF;         /* Pure white for active states */
```

### Text Colors
```css
--text-primary: #FFFFFF;         /* Primary text - white */
--text-secondary: rgba(255, 255, 255, 0.7); /* Secondary text */
--text-muted: rgba(255, 255, 255, 0.5);     /* Muted/disabled text */
```

### Timeline Colors
```css
--timeline-bg: rgba(20, 18, 16, 0.9);      /* Timeline strip background */
--timeline-marker: #FFFFFF;                 /* Playhead marker */
--timeline-tick: rgba(255, 255, 255, 0.3); /* Time tick marks */
--clip-border-active: rgba(255, 255, 255, 0.8); /* Active clip border */
```

---

## 3. Typography

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

### Font Sizes
```css
--text-xs: 11px;    /* Timeline markers, secondary labels */
--text-sm: 13px;    /* Button labels, captions */
--text-base: 14px;  /* Body text, panel content */
--text-lg: 16px;    /* Section headers */
--text-xl: 18px;    /* Panel titles */
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
```

---

## 4. Spacing & Layout

### Base Unit
```css
--spacing-unit: 4px;
--spacing-xs: 4px;   /* 1 unit */
--spacing-sm: 8px;   /* 2 units */
--spacing-md: 12px;  /* 3 units */
--spacing-lg: 16px;  /* 4 units */
--spacing-xl: 24px;  /* 6 units */
--spacing-2xl: 32px; /* 8 units */
```

### Border Radius
```css
--radius-sm: 6px;    /* Small buttons, inputs */
--radius-md: 10px;   /* Cards, medium panels */
--radius-lg: 16px;   /* Large panels, modals */
--radius-xl: 20px;   /* Floating panels */
--radius-full: 50%;  /* Circular buttons */
```

---

## 5. UI Components

### 5.1 Sidebar Icons (Left Toolbar)

**Appearance**: Circular buttons with semi-transparent backgrounds
**Size**: 44px diameter
**Background**: `rgba(50, 45, 42, 0.7)` with subtle warm tint
**Border**: `1px solid rgba(255, 255, 255, 0.1)`
**Icon Color**: `rgba(255, 255, 255, 0.8)`
**Active State**: White background, dark icon

```css
.sidebar-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(50, 45, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sidebar-icon:hover {
  background: rgba(70, 65, 62, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.sidebar-icon.active {
  background: #FFFFFF;
  color: #1A1A1A;
}
```

### 5.2 Floating Panels (Prompt Panel)

**Appearance**: Frosted glass effect with warm undertone
**Background**: `rgba(35, 30, 28, 0.85)`
**Border**: `1px solid rgba(255, 255, 255, 0.08)`
**Border Radius**: `20px`
**Shadow**: Soft, diffused shadow
**Blur**: `backdrop-filter: blur(20px)`

```css
.floating-panel {
  background: rgba(35, 30, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
}
```

### 5.3 Top Bar

**Layout**: Centered title with action buttons
**Title Container**: Pill-shaped with subtle background
**Background**: `rgba(50, 45, 42, 0.6)`

```css
.top-bar-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(50, 45, 42, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

### 5.4 Timeline

**Layout**: Horizontal strip at bottom with time markers
**Background**: Semi-transparent dark
**Clip Thumbnails**: Rounded rectangles with borders
**Active Clip**: White/light border highlight

```css
.timeline-container {
  background: rgba(15, 13, 12, 0.95);
  padding: 16px 24px;
}

.timeline-clip {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.timeline-clip.active {
  border-color: rgba(255, 255, 255, 0.8);
}

.timeline-clip-group {
  display: flex;
  gap: 2px;
  border-radius: 10px;
  overflow: hidden;
}
```

### 5.5 Bottom Control Bar

**Layout**: Media controls left, settings center, actions right
**Button Style**: Circular icons with dark backgrounds

```css
.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(10, 8, 8, 0.95);
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(40, 38, 36, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.settings-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(40, 38, 36, 0.8);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 5.6 Image Thumbnails (in Prompt Panel)

**Layout**: Grid or row of preview images
**Border Radius**: `12px`
**Aspect Ratio**: Square or 4:3

```css
.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.thumbnail {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  object-fit: cover;
}
```

---

## 6. Effects & Animations

### Glassmorphism
```css
.glass {
  background: rgba(35, 30, 28, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(196, 133, 108, 0.3); /* Warm glow */
```

### Transitions
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

### Hover States
- Increase background opacity slightly
- Brighten border color
- Add subtle scale transform (1.02)

---

## 7. Layout Structure

```
+------------------------------------------------------------------+
|  [<]                    [Title ✏️] [+]                            |
|                                                    +-------------+|
|  [icon]                                            | Prompt      ||
|  [icon]                                            | Panel       ||
|  [icon]                                            | (floating)  ||
|  [icon]              MAIN VIDEO PREVIEW            |             ||
|  [icon]              (full bleed)                  +-------------+|
|  [icon]                                                           |
|  [icon]                                                           |
|                                                                   |
+------------------------------------------------------------------+
|  [< >]                                                            |
|  0s   5s   10s   15s   20s   25s   30s   35s   40s   45s   50s   |
|  [clip1][clip2][clip3]  [clip4][clip5]   [clip6]      [+]        |
+------------------------------------------------------------------+
|  [⏮️][◀️][▶️][⏭️]     [9:16] [1440p] [18s] [None]      [👥][⚙️]    |
+------------------------------------------------------------------+
```

---

## 8. Responsive Considerations

### Panel Behavior
- Floating panels should collapse to icons on smaller screens
- Timeline should remain always visible
- Sidebar can become a bottom sheet on mobile

### Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## 9. Iconography

**Style**: Outlined icons with 1.5-2px stroke weight
**Size**: 20-24px for toolbar icons
**Color**: Inherits from text color

Recommended icon libraries:
- Lucide Icons
- Phosphor Icons
- Heroicons (outline variant)

---

## 10. Implementation Notes

### CSS Variables Setup
```css
:root {
  /* Colors */
  --color-bg-primary: #0D0D0D;
  --color-bg-glass: rgba(35, 30, 28, 0.85);
  --color-border-subtle: rgba(255, 255, 255, 0.1);
  --color-text-primary: #FFFFFF;
  --color-accent-warm: #C4856C;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Effects */
  --blur-glass: blur(20px);
  --shadow-panel: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

### Key Principles

1. **Video First**: The video preview is the hero - UI elements float above it
2. **Warm & Cinematic**: Use warm undertones in the dark theme to feel creative/artistic
3. **Subtle Depth**: Use glassmorphism and soft shadows for layered feel
4. **Minimal Chrome**: Keep UI lightweight, let content shine
5. **Consistent Roundness**: Maintain rounded corners throughout for soft, modern feel
