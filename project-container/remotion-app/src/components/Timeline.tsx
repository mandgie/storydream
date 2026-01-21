import { useState, useEffect, useMemo } from 'react';
import { getSequences, subscribeToSequences } from '../remotion-wrapper';

interface SequenceInfo {
  id: string;
  name: string;
  from: number;
  durationInFrames: number;
  type: 'scene' | 'audio' | 'text' | 'effect';
}

interface TimelineProps {
  durationInFrames: number;
  fps: number;
  currentFrame?: number;
  onSeek?: (frame: number) => void;
}

const TRACK_COLORS: Record<string, string> = {
  scene: '#C4856C',
  audio: '#6B8E6B',
  text: '#8B7EC8',
  effect: '#C4A86B',
};

const TRACK_ORDER: SequenceInfo['type'][] = ['scene', 'audio', 'text', 'effect'];

export function Timeline({
  durationInFrames,
  fps,
  currentFrame = 0,
  onSeek,
}: TimelineProps) {
  const [sequences, setSequences] = useState<SequenceInfo[]>([]);
  const [playheadFrame, setPlayheadFrame] = useState(currentFrame);

  // Subscribe to sequence changes
  useEffect(() => {
    // Initial load
    setSequences(getSequences());

    // Subscribe to updates
    const unsubscribe = subscribeToSequences(() => {
      setSequences(getSequences());
    });

    return unsubscribe;
  }, []);

  // Group sequences by type into tracks
  const tracks = useMemo(() => {
    const grouped = new Map<SequenceInfo['type'], SequenceInfo[]>();

    // Initialize all track types
    TRACK_ORDER.forEach((type) => grouped.set(type, []));

    // Group sequences
    sequences.forEach((seq) => {
      const list = grouped.get(seq.type) || [];
      list.push(seq);
      grouped.set(seq.type, list);
    });

    // Filter out empty tracks and convert to array
    return TRACK_ORDER
      .filter((type) => (grouped.get(type) || []).length > 0)
      .map((type) => ({
        type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        items: grouped.get(type) || [],
      }));
  }, [sequences]);

  // Generate time markers (every second)
  const durationSeconds = durationInFrames / fps;
  const timeMarkers = useMemo(() => {
    const markers = [];
    const interval = durationSeconds <= 10 ? 1 : durationSeconds <= 30 ? 2 : 5;
    for (let i = 0; i <= durationSeconds; i += interval) {
      markers.push(i);
    }
    return markers;
  }, [durationSeconds]);

  // Convert frame to percentage
  const frameToPercent = (frame: number) => (frame / durationInFrames) * 100;

  // Convert seconds to percentage
  const secondsToPercent = (seconds: number) => (seconds / durationSeconds) * 100;

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const frame = Math.max(0, Math.min(durationInFrames, Math.round(percent * durationInFrames)));
    setPlayheadFrame(frame);
    onSeek?.(frame);
  };

  useEffect(() => {
    setPlayheadFrame(currentFrame);
  }, [currentFrame]);

  const hasSequences = sequences.length > 0;

  return (
    <div
      style={{
        width: '100%',
        flexShrink: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'rgba(35, 30, 28, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Track labels column */}
        <div
          style={{
            width: '80px',
            flexShrink: 0,
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Tracks
          </div>
          {hasSequences ? (
            tracks.map((track) => (
              <div
                key={track.type}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {track.name}
              </div>
            ))
          ) : (
            <div
              style={{
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              No tracks
            </div>
          )}
        </div>

        {/* Timeline content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Time ruler */}
          <div
            style={{
              height: '28px',
              position: 'relative',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
            }}
            onClick={handleTimelineClick}
          >
            {timeMarkers.map((seconds) => (
              <div
                key={seconds}
                style={{
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  paddingBottom: '4px',
                  left: `${secondsToPercent(seconds)}%`,
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    padding: '0 4px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {seconds}s
                </div>
                <div
                  style={{
                    width: '1px',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>
            ))}

            {/* Playhead on ruler */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '2px',
                zIndex: 10,
                left: `${frameToPercent(playheadFrame)}%`,
                background: '#FFFFFF',
              }}
            />
          </div>

          {/* Tracks */}
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={handleTimelineClick}
          >
            {hasSequences ? (
              tracks.map((track) => (
                <div
                  key={track.type}
                  style={{
                    height: '40px',
                    position: 'relative',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {track.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        bottom: '4px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 8px',
                        fontSize: '11px',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        left: `${frameToPercent(item.from)}%`,
                        width: `${frameToPercent(item.durationInFrames)}%`,
                        background: TRACK_COLORS[item.type],
                        color: '#FFFFFF',
                      }}
                      title={`${item.name} (${item.from}-${item.from + item.durationInFrames} frames)`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div
                style={{
                  height: '40px',
                  position: 'relative',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <span style={{ fontSize: '11px' }}>Waiting for composition data...</span>
              </div>
            )}

            {/* Playhead line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '2px',
                zIndex: 10,
                pointerEvents: 'none',
                left: `${frameToPercent(playheadFrame)}%`,
                background: '#FFFFFF',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
