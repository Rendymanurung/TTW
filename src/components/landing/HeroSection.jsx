import React from 'react';
import { sound } from '../../services/audio.js';

export function HeroSection({ onNavigate }) {
  const scrollToMembers = () => {
    sound.playClick();
    const el = document.getElementById('members');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-heading">
      {/* Background Retro Arcade Video (King of Fighters) */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          className="hero-video-elem"
          autoPlay
          loop
          muted
          playsInline
          poster="/video/kof_hero_poster.jpg"
        >
          <source src="/video/kof_hero_bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </div>

      <div className="container hero-container-content">
        <div className="hero-content-frame">
          <h1 id="hero-heading" className="hero-title">TTW: TAMAT TEPAT WAKTU</h1>
          <div className="hero-actions">
            <button
              onClick={() => { sound.playCoin(); onNavigate('arcade'); }}
              className="btn-pixel btn-coin"
            >
              MASUK ARCADE 🕹️
            </button>
            <button
              onClick={scrollToMembers}
              className="btn-pixel btn-dark"
            >
              KENALAN DULU 👇
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
