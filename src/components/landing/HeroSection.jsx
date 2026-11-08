import React, { useState, useEffect } from 'react';
import { sound } from '../../services/audio.js';

export function HeroSection({ onNavigate }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const phrases = [
      'Finish On Time, No Remidi.',
      'Tamat Tepat Waktu atau Game Over.',
      'Geng Mahasiswa Pemburu Deadline.',
      'Stage Clear: Wisuda Bersama.'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId;

    const typeLoop = () => {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        charIdx--;
      } else {
        charIdx++;
      }

      setDisplayText(current.substring(0, charIdx));

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === current.length) {
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }

      timeoutId = setTimeout(typeLoop, speed);
    };

    typeLoop();
    return () => clearTimeout(timeoutId);
  }, []);

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
          <div className="hero-badge">
            <span className="badge-retro badge-green">STATUS: AKTIF BERBURU TOGA</span>
          </div>
          <h1 id="hero-heading" className="hero-title">TTW: TAMAT TEPAT WAKTU</h1>
          <div id="hero-typewriter" className="hero-typewriter" aria-live="polite">
            {displayText}
          </div>
          <p className="hero-desc">
            Bukan sekadar kawan satu kampus, melainkan satu regu tempur menghadapi rimba tugas akhir, kuis dadakan, dan revisi skripsi tanpa ada kawan yang tertinggal di belakang.
          </p>
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
