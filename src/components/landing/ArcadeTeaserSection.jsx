import React, { useState, useEffect } from 'react';
import { sound } from '../../services/audio.js';

const ICONS = ['🎓', '⏰', '☕', '💻', '7️⃣', '👑'];

export function ArcadeTeaserSection({ onNavigate }) {
  const [reels, setReels] = useState(['🎓', '⏰', '👑']);

  useEffect(() => {
    const interval = setInterval(() => {
      setReels([
        ICONS[Math.floor(Math.random() * ICONS.length)],
        ICONS[Math.floor(Math.random() * ICONS.length)],
        ICONS[Math.floor(Math.random() * ICONS.length)]
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const goToArcade = () => {
    sound.playCoin();
    onNavigate('arcade');
  };

  return (
    <section id="arcade-teaser" className="arcade-teaser-section" aria-labelledby="teaser-heading">
      <div className="container">
        <div className="cabinet-teaser">
          <span className="badge-retro badge-red" style={{ marginBottom: '0.75rem' }}>
            BONUS STAGE
          </span>
          <h2 id="teaser-heading" style={{ color: 'var(--accent-coin)', marginBottom: '0.5rem' }}>
            MESIN ARCADE TTW
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Uji keberuntunganmu sekarang! Dapatkan saldo modal 1.000 koin virtual gratis untuk bermain di lobby game kami.
          </p>

          <div
            className="mini-slot-screen"
            aria-label="Cuplikan Mesin Slot - Klik untuk Masuk Arcade"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            title="Klik untuk Masuk ke Mesin Arcade"
            onClick={goToArcade}
          >
            <div className="mini-reel">{reels[0]}</div>
            <div className="mini-reel">{reels[1]}</div>
            <div className="mini-reel">{reels[2]}</div>
          </div>

          <p className="teaser-reward">💰 SALDO AWAL: 1.000 KOIN GRATIS</p>

          <button
            onClick={goToArcade}
            className="btn-pixel btn-coin"
            style={{ fontSize: '0.9rem' }}
          >
            INSERT COIN & PLAY 🕹️
          </button>
        </div>
      </div>
    </section>
  );
}
