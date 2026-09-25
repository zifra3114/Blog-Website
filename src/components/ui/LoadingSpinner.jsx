import React, { useState, useEffect } from 'react';
import "../../styles/globals.css";


const LoadingSpinner = ({ className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'DEVBLOG';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 110);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`devblog-loader-overlay ${className}`}>
      {/* Dynamic Background Glow Orbs */}
      <div className="devblog-glow-orb orb-primary"></div>
      <div className="devblog-glow-orb orb-accent"></div>

      {/* Center Stage Box */}
      <div className="devblog-loader-content">
        {/* Typewriter + Massive Glowing Title */}
        <h1 className="devblog-loader-title">
          {displayText}
          <span className="devblog-cursor">|</span>
        </h1>

        {/* Tagline aligned with Login Screen Theme */}
        <p className="devblog-loader-tagline">
          START YOUR DEVELOPER <span className="highlight-gradient">JOURNEY.</span>
        </p>

        {/* Premium Neon Ring Spinner */}
        <div className="devblog-ring-spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;