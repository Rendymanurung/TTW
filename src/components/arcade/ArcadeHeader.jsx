import React, { useState, useEffect } from 'react';
import { wallet } from '../../services/wallet.js';
import { sound } from '../../services/audio.js';
import { showToast } from '../../services/toast.js';

export function ArcadeHeader({ onNavigate }) {
  const [balance, setBalance] = useState(wallet.getBalance());
  const [muted, setMuted] = useState(sound.isMuted());
  const [crtOff, setCrtOff] = useState(() => localStorage.getItem('ttw_crt_off') === 'true');

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

  const handleClaimDaily = () => {
    const res = wallet.claimDailyBonus();
    if (res.success) {
      sound.playWin();
      showToast(`Bonus harian berhasil! +${res.amount} Koin virtual ditambahkan.`);
    } else {
      sound.playBuzzer();
      const hours = Math.ceil(res.remaining / (1000 * 60 * 60));
      showToast(`Bonus harian sudah diambil. Coba lagi dalam ${hours} jam.`);
    }
  };

  const handleReset = () => {
    wallet.resetBalance();
    sound.playCoin();
    showToast('Saldo koin berhasil direset ke 1.000 koin!');
  };

  return (
    <>
      <header className="arcade-header" role="banner">
        <div className="arcade-nav-wrap">
          <div className="arcade-brand">
            <button
              onClick={() => { sound.playClick(); onNavigate('landing'); }}
              className="btn-pixel btn-dark"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem' }}
            >
              ⬅️ KEMBALI KE MARKAS
            </button>
            <span className="arcade-title font-pixel">
              🕹️ TTW ARCADE
            </span>
          </div>

          <div className="arcade-tools">
            <div className="hud-wallet" title="Saldo Koin Virtual">
              <span>🪙 SALDO:</span>
              <span className="hud-coin-val">{balance.toLocaleString('id-ID')}</span>
            </div>

            <button
              className="btn-pixel btn-coin claim-daily-btn"
              type="button"
              style={{ padding: '0.4rem 0.65rem', fontSize: '0.65rem' }}
              onClick={handleClaimDaily}
            >
              BONUS HARIAN 🎁
            </button>

            <button
              className="btn-pixel btn-dark reset-wallet-btn"
              type="button"
              style={{ padding: '0.4rem 0.65rem', fontSize: '0.65rem' }}
              onClick={handleReset}
            >
              RESET 🔄
            </button>

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
          </div>
        </div>
      </header>

      <div className="arcade-disclaimer" role="note">
        ⚠️ PERINGATAN: Koin dalam arcade ini bersifat 100% fiktif tanpa nilai tukar uang asli, tanpa penarikan tunai, dan murni untuk sarana hiburan geng TTW.
      </div>
    </>
  );
}
