// This file wraps Remotion's exports and intercepts Sequence
// to automatically register with our timeline system

// Re-export everything from real-remotion (alias to actual remotion package)
export * from 'real-remotion';

// Override Sequence with our tracked version
import { Sequence as OriginalSequence } from 'real-remotion';
import { useEffect, useId } from 'react';
import React from 'react';

// Timeline registration interface
export interface SequenceInfo {
  id: string;
  name: string;
  from: number;
  durationInFrames: number;
  type: 'scene' | 'audio' | 'text' | 'effect';
}

// Global registry for sequences (works without context)
const sequenceRegistry = new Map<string, SequenceInfo>();
let updateListeners: Array<() => void> = [];

export function getSequences(): SequenceInfo[] {
  return Array.from(sequenceRegistry.values());
}

export function subscribeToSequences(callback: () => void): () => void {
  updateListeners.push(callback);
  return () => {
    updateListeners = updateListeners.filter(l => l !== callback);
  };
}

function notifyListeners() {
  updateListeners.forEach(l => l());
}

function registerSequence(info: SequenceInfo) {
  sequenceRegistry.set(info.id, info);
  notifyListeners();
}

function unregisterSequence(id: string) {
  sequenceRegistry.delete(id);
  notifyListeners();
}

// Props for our tracked sequence - matches Remotion's Sequence props
interface TrackedSequenceProps {
  children: React.ReactNode;
  from?: number;
  durationInFrames?: number;
  name?: string;
  layout?: 'absolute-fill' | 'none';
  showInTimeline?: boolean;
  premountFor?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Wrapped Sequence that auto-registers with timeline
export const Sequence: React.FC<TrackedSequenceProps> = ({
  children,
  name,
  from = 0,
  durationInFrames,
  ...rest
}) => {
  const id = useId();

  useEffect(() => {
    if (durationInFrames !== undefined) {
      // Infer type from name if possible
      let type: SequenceInfo['type'] = 'scene';
      const lowerName = (name || '').toLowerCase();
      if (lowerName.includes('audio') || lowerName.includes('music') || lowerName.includes('sound')) {
        type = 'audio';
      } else if (lowerName.includes('text') || lowerName.includes('title') || lowerName.includes('subtitle')) {
        type = 'text';
      } else if (lowerName.includes('effect') || lowerName.includes('transition')) {
        type = 'effect';
      }

      registerSequence({
        id,
        name: name || 'Sequence',
        from,
        durationInFrames,
        type,
      });

      return () => {
        unregisterSequence(id);
      };
    }
  }, [id, name, from, durationInFrames]);

  return React.createElement(
    OriginalSequence,
    { from, durationInFrames, name, ...rest },
    children
  );
};
