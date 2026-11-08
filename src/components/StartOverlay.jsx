import React, { useState, useEffect } from 'react';
import { sound } from '../services/audio.js';

export function StartOverlay() {
  const [hidden, setHidden] = useState(() => {
    return sessionStorage.getItem('ttw_start_dismissed') === 'true';
  });

  const dismiss = () => {
    if (hidden) return;
    try {
      sound.playCoin();
      sound.startBgm();
    } catch {
      // Audio fallback
    }
    setHidden(true);
    sessionStorage.setItem('ttw_start_dismissed', 'true');
    const mainHero = document.querySelector('.hero-title');
    if (mainHero) mainHero.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hidden) {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hidden]);

  if (hidden) return null;

  return (
    <aside
      id="start-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Layar Mulai Arcade"
      onClick={dismiss}
    >
      <div className="start-box" onClick={(e) => { e.stopPropagation(); dismiss(); }}>
        <p className="badge-retro badge-cyan" style={{ marginBottom: '0.75rem' }}>
          INSERT COIN TO CONTINUE
        </p>
        <h1 className="start-title">TTW ARCADE</h1>
        <p className="start-subtitle">TAMAT TEPAT WAKTU SYSTEM v2.0</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button
            id="press-start-btn"
            className="btn-pixel btn-coin press-start-btn"
            type="button"
            onClick={(e) => { e.stopPropagation(); dismiss(); }}
          >
            PRESS START [ENTER]
          </button>
          <button
            className="btn-pixel btn-dark"
            type="button"
            onClick={(e) => { e.stopPropagation(); dismiss(); }}
            style={{ fontSize: '0.65rem', padding: '0.5rem 1rem' }}
          >
            LEWATI LAYAR MULAI ⏩
          </button>
        </div>
        
        <p className="start-skip-note">Ketuk di mana saja pada layar atau tekan tombol apa saja untuk masuk</p>
      </div>
    </aside>
  );
}
