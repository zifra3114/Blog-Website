import React, { useState, useEffect } from 'react';
import "../../styles/globals.css";

const LoadingSpinner = ({ onFinish, className = '' }) => {
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

        // Loading complete
        setTimeout(() => {
          onFinish();
        }, 500);
      }
    }, 110);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className={`devblog-loader-overlay ${className}`}>

      <div className="devblog-glow-orb orb-primary"></div>
      <div className="devblog-glow-orb orb-accent"></div>

      <div className="devblog-loader-content">

        <h1 className="devblog-loader-title">
          {displayText}
          <span className="devblog-cursor">|</span>
        </h1>

        <p className="devblog-loader-tagline">
          START YOUR DEVELOPER{' '}
          <span className="highlight-gradient">
            JOURNEY.
          </span>
        </p>

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
