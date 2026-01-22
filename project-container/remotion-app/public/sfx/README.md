# Sound Effects Library

This directory contains sound effects for use in Remotion video productions.

## Status

**Current:** Placeholder files (silent audio)
**TODO:** Replace with actual sound effect files

## Directory Structure

```
sfx/
├── transitions/    # 12 files - Whooshes, swooshes, movement sounds
├── impacts/        # 13 files - Clicks, pops, hits, emphasis sounds
├── ui/             # 12 files - Interface and notification sounds
├── ambient/        # 10 files - Background and atmospheric sounds
└── musical/        # 12 files - Stingers, risers, musical accents
```

## Usage

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

<Audio src={staticFile("sfx/transitions/whoosh-fast.mp3")} volume={0.6} />
```

## Adding Real Sound Files

Replace the placeholder `.mp3` files with actual audio files:
- Keep the same filenames
- MP3 format recommended
- Normalize audio levels
- Trim silence from start/end

See `.claude/skills/sound-effects/rules/catalog.md` for the full list of expected files and their descriptions.
