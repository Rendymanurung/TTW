import React, { useState, useEffect } from 'react';
import { wallet } from '../services/wallet.js';
import { sound } from '../services/audio.js';
import { showToast } from '../services/toast.js';

export function HudNav({ currentRoute, onNavigate }) {
  const [balance, setBalance] = useState(wallet.getBalance());
  const [muted, setMuted] = useState(sound.isMuted());
  const [crtOff, setCrtOff] = useState(() => localStorage.getItem('ttw_crt_off') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleWallet = (e) => {
      setBalance(e.detail.balance);
    };
    const handleMute = (e) => {
      setMuted(e.detail);
    };
    window.addEventListener('ttw-wallet-updated', handleWallet);
    window.addEventListener('ttw-audio-mute-changed', handleMute);
    return () => {
      window.removeEventListener('ttw-wallet-updated', handleWallet);
      window.removeEventListener('ttw-audio-mute-changed', handleMute);
    };
  }, []);

  const handleAudioToggle = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) sound.playCoin();
    showToast(isNowMuted ? 'Suara arcade dimatikan' : 'Suara arcade aktif');
  };

  const handleCrtToggle = () => {
    sound.playClick();
    const nextVal = !crtOff;
    setCrtOff(nextVal);
    localStorage.setItem('ttw_crt_off', nextVal);
    window.dispatchEvent(new CustomEvent('ttw-crt-changed', { detail: nextVal }));
    showToast(nextVal ? 'Efek CRT dimatikan' : 'Efek CRT dinyalakan');
  };

  const handleAnchorClick = (e, anchor) => {
    setMenuOpen(false);
    if (currentRoute !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="hud-nav" role="banner">
      <div className="hud-container">
        <a
          href="#hero"
          className="hud-logo"
          aria-label="TTW Beranda"
          onClick={(e) => { e.preventDefault(); handleAnchorClick(e, '#hero'); }}
        >
          <span>TTW</span>
        </a>

        <button
          className="mobile-toggle"
          type="button"
          aria-label="Buka Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={`hud-menu ${menuOpen ? 'open' : ''}`} role="navigation" aria-label="Menu Utama">
          <a href="#members" className="hud-link" onClick={(e) => { e.preventDefault(); handleAnchorClick(e, '#members'); }}>
            FIGHTERS
          </a>
          <a href="#timeline" className="hud-link" onClick={(e) => { e.preventDefault(); handleAnchorClick(e, '#timeline'); }}>
            PETA LEVEL
          </a>
          <a href="#gallery" className="hud-link" onClick={(e) => { e.preventDefault(); handleAnchorClick(e, '#gallery'); }}>
            GALERI
          </a>
          <a
            href="#arcade"
            className="hud-link"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              sound.playClick();
              onNavigate('arcade');
            }}
          >
            ARCADE
          </a>
        </nav>

        <div className="hud-controls">
          <div className="hud-wallet" title="Saldo Koin Virtual">
            <span>🪙</span>
            <span className="hud-coin-val">{balance.toLocaleString('id-ID')}</span>
          </div>
          
          <button
            className="hud-icon-btn toggle-audio-btn"
            type="button"
            title="Suara Arcade"
            aria-label={muted ? 'Nyalakan Suara' : 'Matikan Suara'}
            onClick={handleAudioToggle}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          
          <button
            className="hud-icon-btn toggle-crt-btn"
            type="button"
            title="Toggle Efek CRT"
            aria-label="Toggle CRT"
            aria-pressed={!crtOff}
            onClick={handleCrtToggle}
          >
            📺
          </button>

          {currentRoute === 'landing' ? (
            <button
              onClick={() => { sound.playClick(); onNavigate('arcade'); }}
              className="btn-pixel btn-coin"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.65rem' }}
            >
              MASUK ARCADE
            </button>
          ) : (
            <button
              onClick={() => { sound.playClick(); onNavigate('landing'); }}
              className="btn-pixel btn-dark"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.65rem' }}
            >
              KE MARKAS
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
