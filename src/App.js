import React, { useState } from 'react';
import './App.css';

const sampleImages = Array.from({ length: 9 }, (_, i) => `/daniel-und-christin-hochzeit-danke/gallery/foto${i + 1}.jpeg`);

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <>
      <section className="hero">
        <img src="/daniel-und-christin-hochzeit-danke/hero.jpg" alt="Hero" className="hero-img" />
        <div className="hero-text">
          <h1>Dankeschön</h1>
          <p>Es war uns ein Fest mit euch</p>
        </div>
        <audio controls autoPlay loop>
          <source src={process.env.PUBLIC_URL + '/song.mp3'} type="audio/mp3" />
          Dein Browser unterstützt keine Audio-Wiedergabe.
        </audio>
        <p className="audio-text">🎵 Abspielen: <em>unser Hochzeitssong</em></p>
      </section>

      <div className="app">
        <section className="danke-text">
          <h2>Ihr Lieben</h2>
          <h3>wir sagen herzlich dankeschön</h3>
          <p>Wir hatten einen unvergesslichen Tag mit unzähligen wunderschönen Momenten. Dank Euch wird er uns für immer in Erinnerung bleiben.</p>
          <p>Wir möchten uns ganz herzlich für die zahlreichen Glückwünsche, Geschenke und Aufmerksamkeiten zu unserer Hochzeit bedanken. Habt vielen Dank.</p>
          <p className="signatur">Daniel & Christin</p>
        </section>

        <section className="galerie">
          {sampleImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Foto ${i + 1}`}
              className="galerie-img"
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </section>

        {selectedIndex !== null && (
  <div className="lightbox" onClick={() => setSelectedIndex(null)}>
    <button className="lightbox-close" onClick={() => setSelectedIndex(null)}>×</button>
    <button
      className="lightbox-prev"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedIndex((selectedIndex - 1 + sampleImages.length) % sampleImages.length);
      }}
    >
      ‹
    </button>
    <img
      src={sampleImages[selectedIndex]}
      alt="Großansicht"
      className="lightbox-img"
      onClick={(e) => e.stopPropagation()}
    />
    <button
      className="lightbox-next"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedIndex((selectedIndex + 1) % sampleImages.length);
      }}
    >
      ›
    </button>
  </div>
)}
      </div>
    </>
  );
}
