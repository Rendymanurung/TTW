import React from 'react';
import { wallet } from '../services/wallet.js';
import { sound } from '../services/audio.js';
import { showToast } from '../services/toast.js';

export function Footer({ onNavigate }) {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <p className="footer-quote">GAME OVER? BELUM! KITA TAMAT TEPAT WAKTU!</p>
        
        <div className="footer-links">
          <a href="#hero" className="footer-link" onClick={scrollToTop}>
            KEMBALI KE ATAS ⬆️
          </a>
          <button
            className="footer-link"
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => { sound.playClick(); onNavigate('arcade'); }}
          >
            LOBBY ARCADE 🎮
          </button>
          <button
            className="footer-link claim-daily-btn"
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={handleClaimDaily}
          >
            KLAIM BONUS HARIAN 🎁
          </button>
          <button
            className="footer-link reset-wallet-btn"
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={handleReset}
          >
            RESET SALDO 🔄
          </button>
        </div>

        <p className="footer-konami">
          💡 Petunjuk Rahasia: Masukkan kode Konami (Atas Atas Bawah Bawah Kiri Kanan Kiri Kanan B A) untuk bonus koin tersembunyi.
        </p>
        <p className="footer-copy">
          &copy; 2026 TTW (Tamat Tepat Waktu). Koin fiktif untuk hiburan murni. Tanpa uang asli.
        </p>
      </div>
    </footer>
  );
}
