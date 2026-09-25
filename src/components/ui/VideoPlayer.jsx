import { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [userPaused, setUserPaused] = useState(false); // Track if user manually paused

  // Auto-play video when component mounts and is visible
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If video comes into view (>50% visible) and user hasn't manually paused
          if (entry.intersectionRatio >= 0.5 && !userPaused) {
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(err => {
              console.log('Autoplay prevented:', err);
            });
          }
          // If video scrolled out of view (<50% visible) and is playing
          else if (entry.intersectionRatio < 0.5 && isPlaying) {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isPlaying, userPaused]);

  const togglePlay = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setUserPaused(false); // User wants to play, clear the pause flag
    } else {
      video.pause();
      setIsPlaying(false);
      setUserPaused(true); // User manually paused, set the flag
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent triggering video play/pause
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);

    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);

      // Unmute if volume is increased from 0
      if (newVolume > 0 && isMuted) {
        video.muted = false;
        setIsMuted(false);
      }

      // Mute if volume is set to 0
      if (newVolume === 0) {
        video.muted = true;
        setIsMuted(true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="insta-post-media-frame"
      style={{
        backgroundColor: '#000',
        position: 'relative',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        preload="metadata"
        className="insta-post-fluid-img"
        loop
        playsInline
        style={{
          objectFit: 'contain',
          backgroundColor: '#000',
          maxHeight: '500px',
          width: '100%',
          display: 'block',
          pointerEvents: 'none' // Let container handle clicks
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Video failed to load:', e);
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Custom Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          transition: 'opacity 0.3s'
        }}
      >
        {/* Play Button (Only show when paused) */}
        {!isPlaying && (
          <div
            style={{
              pointerEvents: 'none',
              background: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              color: 'white'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Volume Controls (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '8px 12px',
          borderRadius: '8px',
          opacity: showControls || !isPlaying ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : volume < 0.5 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            width: '60px',
            cursor: 'pointer',
            accentColor: 'var(--insta-accent-blue)',
          }}
          title="Volume"
        />
      </div>

      {/* Pause Button (Bottom Left) - visible during playback on hover */}
      {isPlaying && showControls && (
        <button
          onClick={togglePlay}
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
          Pause
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
