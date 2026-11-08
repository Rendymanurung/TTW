import React, { useState } from 'react';
import { wallet } from '../../services/wallet.js';
import { sound } from '../../services/audio.js';
import { showToast } from '../../services/toast.js';

const VALUES = [
  { label: '2', val: 2 },
  { label: '3', val: 3 },
  { label: '4', val: 4 },
  { label: '5', val: 5 },
  { label: '6', val: 6 },
  { label: '7', val: 7 },
  { label: '8', val: 8 },
  { label: '9', val: 9 },
  { label: '10', val: 10 },
  { label: 'J', val: 11 },
  { label: 'Q', val: 12 },
  { label: 'K', val: 13 },
  { label: 'A', val: 14 }
];

const SUITS = ['♠', '♥', '♦', '♣'];

function getRandomCard() {
  const v = VALUES[Math.floor(Math.random() * VALUES.length)];
  const s = SUITS[Math.floor(Math.random() * SUITS.length)];
  const isRed = (s === '♥' || s === '♦');
  return { label: v.label, val: v.val, suit: s, color: isRed ? 'red' : 'black' };
}

export function HighLow({ isActive }) {
  const [currentCard, setCurrentCard] = useState(null);
  const [currentBet] = useState(20);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('TEKAN MULAI GAME UNTUK MEMBUKA KARTU PERTAMA!');
  const [messageColor, setMessageColor] = useState('var(--accent-cyan)');

  const getPotentialPayout = (stk) => {
    if (stk === 0) return currentBet;
    const mult = Math.pow(1.5, stk);
    return Math.floor(currentBet * mult);
  };

  const startGame = () => {
    if (wallet.getBalance() < currentBet) {
      sound.playBuzzer();
      setMessage('SALDO KOIN TIDAK CUKUP!');
      setMessageColor('var(--accent-red)');
      showToast('Saldo tidak cukup untuk High-Low.');
      return;
    }

    wallet.deductCoins(currentBet);
    setIsPlaying(true);
    setStreak(0);
    const card = getRandomCard();
    setCurrentCard(card);

    sound.playCard();
    setMessage('TEBAK: LEBIH TINGGI ATAU LEBIH RENDAH?');
    setMessageColor('var(--accent-cyan)');
  };

  const guess = (isHigher) => {
    if (!isPlaying) return;

    const nextCard = getRandomCard();
    sound.playCard();

    const isCorrect = isHigher
      ? (nextCard.val >= currentCard.val)
      : (nextCard.val <= currentCard.val);

    setCurrentCard(nextCard);

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      sound.playCoin();
      const pot = getPotentialPayout(nextStreak);
      setMessage(`TEBAKAN BENAR! POT: ${pot.toLocaleString('id-ID')} KOIN! LANJUT ATAU AMBIL?`);
      setMessageColor('var(--accent-green)');
    } else {
      setIsPlaying(false);
      sound.playBuzzer();
      setMessage('TEBAKAN SALAH! POT HANGUS!');
      setMessageColor('var(--accent-red)');
    }
  };

  const cashOut = () => {
    if (!isPlaying || streak === 0) return;

    const winAmount = getPotentialPayout(streak);
    wallet.addCoins(winAmount, true);
    sound.playWin();

    setIsPlaying(false);
    setMessage(`STAGE CLEAR! BERHASIL AMBIL +${winAmount.toLocaleString('id-ID')} KOIN!`);
    setMessageColor('var(--accent-coin)');
    showToast(`CASH OUT: +${winAmount.toLocaleString('id-ID')} Koin!`);
  };

  const pot = getPotentialPayout(streak);

  return (
    <section id="stage-highlow" className={`game-screen-panel ${isActive ? 'active' : ''}`} aria-labelledby="hl-game-title">
      <div className="game-top-bar">
        <h3 id="hl-game-title" className="game-title-active font-pixel">🎲 TEBAK HIGH-LOW</h3>
        <span className="badge-retro badge-cyan">MULTIPLIER STREAK</span>
      </div>

      <div className="hl-arena">
        <div className="hl-streak-badge font-pixel">
          STREAK SAAT INI: <span id="hl-streak-val">{streak}x STREAK</span> | POT: <span id="hl-pot-val">{pot.toLocaleString('id-ID')} KOIN</span>
        </div>

        <div className="hl-card-display">
          {currentCard ? (
            <div className={`bj-card ${currentCard.color === 'red' ? 'red' : ''}`} style={{ width: '80px', height: '110px' }}>
              <span style={{ alignSelf: 'flex-start' }}>{currentCard.label}</span>
              <span style={{ fontSize: '1.8rem', alignSelf: 'center' }}>{currentCard.suit}</span>
              <span style={{ alignSelf: 'flex-end' }}>{currentCard.label}</span>
            </div>
          ) : (
            <div className="bj-card" style={{ width: '80px', height: '110px' }}>
              <span style={{ fontSize: '2rem' }}>🂠</span>
            </div>
          )}
        </div>

        <div id="hl-message" className="slot-message" style={{ color: messageColor }} aria-live="polite">
          {message}
        </div>

        <div className="bj-controls" style={{ marginBottom: '1.5rem' }}>
          <button
            id="hl-higher-btn"
            className="btn-pixel btn-green"
            type="button"
            disabled={!isPlaying}
            style={{ background: 'var(--accent-green)', color: '#000' }}
            onClick={() => {
              if (!isPlaying) {
                showToast("Tekan 'MULAI GAME' terlebih dahulu untuk membuka kartu!");
                return;
              }
              guess(true);
            }}
          >
            ⬆️ LEBIH TINGGI
          </button>
          <button
            id="hl-lower-btn"
            className="btn-pixel btn-red"
            type="button"
            disabled={!isPlaying}
            onClick={() => {
              if (!isPlaying) {
                showToast("Tekan 'MULAI GAME' terlebih dahulu untuk membuka kartu!");
                return;
              }
              guess(false);
            }}
          >
            ⬇️ LEBIH RENDAH
          </button>
          <button
            id="hl-cashout-btn"
            className="btn-pixel btn-coin"
            type="button"
            disabled={!isPlaying || streak === 0}
            onClick={cashOut}
          >
            💰 AMBIL HADIAH (CASH OUT)
          </button>
        </div>

        <button
          id="hl-start-btn"
          className={`btn-pixel btn-coin ${!isPlaying ? 'pulse-btn' : ''}`}
          type="button"
          disabled={isPlaying}
          onClick={startGame}
        >
          MULAI GAME (TARUHAN 20 KOIN) 🎲
        </button>
      </div>
    </section>
  );
}
