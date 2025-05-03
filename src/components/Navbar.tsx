import React, { useState, useEffect } from 'react';
import metadata from '../data/metadata.json';
import './Navbar.css';

// Try to import the audio file
let audioFile: string;
try {
  audioFile = require('../assets/audio/song.mp3');
} catch (error) {
  console.warn('Audio file not found:', error);
  audioFile = ''; // Fallback to empty string if file not found
}

const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = () => {
    try {
      if (!audioFile) {
        setAudioError('Audio file not found');
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio(audioFile);
        
        audioRef.current.addEventListener('error', (e) => {
          setAudioError('Audio file not found or not supported');
          console.error('Audio error:', e);
        });
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          setAudioError('Failed to play audio: ' + error.message);
          console.error('Playback error:', error);
        });
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      setAudioError('Error initializing audio: ' + (error as Error).message);
      console.error('Audio initialization error:', error);
    }
  };


  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <div className="navbar-content">
        <button 
          className="play-button" 
          onClick={togglePlay}
          title={audioError || (isPlaying ? 'Pause' : 'Play')}
          disabled={!audioFile}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
        <div className="names">
          <span>{metadata.hero.name1}</span>
          <span className="and">&</span>
          <span>{metadata.hero.name2}</span>
        </div>
        <div className="date">
        <span>{metadata.hero.date} {metadata.hero.year}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 