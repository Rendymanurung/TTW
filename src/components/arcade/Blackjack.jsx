import React, { useState } from 'react';
import { wallet } from '../../services/wallet.js';
import { sound } from '../../services/audio.js';
import { showToast } from '../../services/toast.js';

const SUITS = [
  { symbol: '♠', color: 'black' },
  { symbol: '♥', color: 'red' },
  { symbol: '♦', color: 'red' },
  { symbol: '♣', color: 'black' }
];

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
  { label: 'J', val: 10 },
  { label: 'Q', val: 10 },
  { label: 'K', val: 10 },
  { label: 'A', val: 11 }
];

function createDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const v of VALUES) {
      deck.push({ label: v.label, val: v.val, suit: s.symbol, color: s.color });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function calculateHand(hand) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    if (c.label === 'A') {
      aces++;
      total += 11;
    } else {
      total += c.val;
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export function Blackjack({ isActive }) {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [currentBet, setCurrentBet] = useState(25);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [revealDealer, setRevealDealer] = useState(false);
  const [message, setMessage] = useState('PASANG CHIP TARUHAN LALU TEKAN BAGIKAN KARTU!');
  const [messageColor, setMessageColor] = useState('var(--text-main)');

  const startRound = () => {
    if (wallet.getBalance() < currentBet) {
      sound.playBuzzer();
      setMessage('SALDO KOIN TIDAK CUKUP!');
      setMessageColor('var(--accent-red)');
      showToast('Saldo koin tidak mencukupi untuk taruhan.');
      return;
    }

    wallet.deductCoins(currentBet);
    const newDeck = createDeck();
    const p1 = newDeck.pop();
    const d1 = newDeck.pop();
    const p2 = newDeck.pop();
    const d2 = newDeck.pop();

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameInProgress(true);
    setRevealDealer(false);
    setMessage('PILIH TINDAKAN: HIT, STAND, ATAU DOUBLE!');
    setMessageColor('var(--text-main)');
    sound.playCard();

    const pScore = calculateHand(pHand);
    const dScore = calculateHand(dHand);

    if (pScore === 21) {
      setRevealDealer(true);
      setGameInProgress(false);
      if (dScore === 21) {
        wallet.addCoins(currentBet);
        setMessage('KEDUA PIHAK BLACKJACK! PUSH (SERI)');
        setMessageColor('var(--accent-coin)');
      } else {
        const winVal = Math.floor(currentBet * 2.5);
        wallet.addCoins(winVal, true);
        sound.playWin();
        setMessage(`NATURAL BLACKJACK 21! +${winVal.toLocaleString('id-ID')} KOIN!`);
        setMessageColor('var(--accent-coin)');
        showToast(`BLACKJACK MENANG 3:2! +${winVal} Koin`);
      }
    }
  };

  const hit = () => {
    if (!gameInProgress) return;
    sound.playCard();
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const score = calculateHand(newHand);
    if (score > 21) {
      setGameInProgress(false);
      setRevealDealer(true);
      sound.playBuzzer();
      setMessage(`BUST! TOTAL KARTU (${score}) LEWAT 21.`);
      setMessageColor('var(--accent-red)');
    } else if (score === 21) {
      standWithHand(newHand, newDeck);
    }
  };

  const stand = () => {
    if (!gameInProgress) return;
    standWithHand(playerHand, deck);
  };

  const standWithHand = (pHand, curDeck) => {
    setGameInProgress(false);
    setRevealDealer(true);

    const dHand = [...dealerHand];
    const workingDeck = [...curDeck];
    let dScore = calculateHand(dHand);

    while (dScore < 17) {
      dHand.push(workingDeck.pop());
      dScore = calculateHand(dHand);
    }

    setDealerHand(dHand);
    setDeck(workingDeck);

    const pScore = calculateHand(pHand);

    if (dScore > 21) {
      const winVal = currentBet * 2;
      wallet.addCoins(winVal, true);
      sound.playWin();
      setMessage(`DEALER BUST (${dScore})! PEMAIN MENANG +${winVal.toLocaleString('id-ID')} KOIN!`);
      setMessageColor('var(--accent-green)');
    } else if (pScore > dScore) {
      const winVal = currentBet * 2;
      wallet.addCoins(winVal, true);
      sound.playWin();
      setMessage(`PEMAIN MENANG (${pScore} vs ${dScore})! +${winVal.toLocaleString('id-ID')} KOIN!`);
      setMessageColor('var(--accent-green)');
    } else if (pScore < dScore) {
      sound.playBuzzer();
      setMessage(`DEALER MENANG (${dScore} vs ${pScore}).`);
      setMessageColor('var(--accent-red)');
    } else {
      wallet.addCoins(currentBet);
      sound.playCoin();
      setMessage(`SERI / PUSH (${pScore} vs ${dScore})! TARUHAN KEMBALI.`);
      setMessageColor('var(--accent-cyan)');
    }
  };

  const doubleDown = () => {
    if (!gameInProgress || playerHand.length !== 2) return;
    if (wallet.getBalance() < currentBet) {
      showToast('Saldo koin tidak cukup untuk Double!');
      return;
    }

    wallet.deductCoins(currentBet);
    const doubledBet = currentBet * 2;
    setCurrentBet(doubledBet);

    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];

    sound.playCard();
    setDeck(newDeck);
    setPlayerHand(newHand);

    const score = calculateHand(newHand);
    if (score > 21) {
      setGameInProgress(false);
      setRevealDealer(true);
      sound.playBuzzer();
      setMessage(`BUST! TOTAL KARTU (${score}) LEWAT 21.`);
      setMessageColor('var(--accent-red)');
    } else {
      standWithHand(newHand, newDeck);
    }
  };

  const handleChipClick = (val) => {
    if (gameInProgress) return;
    sound.playClick();
    setCurrentBet(val);
  };

  const pScore = calculateHand(playerHand);
  const dScore = revealDealer
    ? calculateHand(dealerHand)
    : (dealerHand.length > 0 ? `${dealerHand[0].val} + ?` : '?');

  return (
    <section id="stage-blackjack" className={`game-screen-panel ${isActive ? 'active' : ''}`} aria-labelledby="bj-game-title">
      <div className="game-top-bar">
        <h3 id="bj-game-title" className="game-title-active font-pixel">🃏 BLACKJACK RETRO 21</h3>
        <span className="badge-retro badge-green">DEALER STAND DI 17</span>
      </div>

      <div className="bj-felt-table">
        <div className="bj-area-label">AREA BANDAR (DEALER)</div>
        <div id="bj-dealer-score" className="bj-score-pill">DEALER: {dScore}</div>
        <div id="bj-dealer-cards" className="bj-cards-row" aria-label="Kartu Dealer">
          {dealerHand.length === 0 ? (
            <>
              <div className="bj-card hidden">🂠</div>
              <div className="bj-card hidden">🂠</div>
            </>
          ) : (
            dealerHand.map((c, idx) => {
              const isHole = (idx === 1 && !revealDealer);
              if (isHole) {
                return <div key={idx} className="bj-card hidden">🂠</div>;
              }
              return (
                <div key={idx} className={`bj-card ${c.color === 'red' ? 'red' : ''}`}>
                  <span style={{ alignSelf: 'flex-start' }}>{c.label}</span>
                  <span style={{ fontSize: '1.4rem', alignSelf: 'center' }}>{c.suit}</span>
                  <span style={{ alignSelf: 'flex-end' }}>{c.label}</span>
                </div>
              );
            })
          )}
        </div>

        <div id="bj-message" className="slot-message" style={{ color: messageColor }} aria-live="polite">
          {message}
        </div>

        <div className="bj-area-label">AREA PEMAIN</div>
        <div id="bj-player-cards" className="bj-cards-row" aria-label="Kartu Pemain">
          {playerHand.length === 0 ? (
            <>
              <div className="bj-card hidden">🂠</div>
              <div className="bj-card hidden">🂠</div>
            </>
          ) : (
            playerHand.map((c, idx) => (
              <div key={idx} className={`bj-card ${c.color === 'red' ? 'red' : ''}`}>
                <span style={{ alignSelf: 'flex-start' }}>{c.label}</span>
                <span style={{ fontSize: '1.4rem', alignSelf: 'center' }}>{c.suit}</span>
                <span style={{ alignSelf: 'flex-end' }}>{c.label}</span>
              </div>
            ))
          )}
        </div>
        <div id="bj-player-score" className="bj-score-pill">PEMAIN: {pScore}</div>

        <div className="bj-controls" style={{ marginBottom: '1rem' }}>
          <button
            id="bj-hit-btn"
            className="btn-pixel btn-cyan"
            type="button"
            disabled={!gameInProgress}
            onClick={() => {
              if (!gameInProgress) {
                showToast("Tekan 'BAGIKAN KARTU' terlebih dahulu untuk memulai!");
                return;
              }
              hit();
            }}
          >
            HIT (+KARTU)
          </button>
          <button
            id="bj-stand-btn"
            className="btn-pixel btn-red"
            type="button"
            disabled={!gameInProgress}
            onClick={() => {
              if (!gameInProgress) {
                showToast("Tekan 'BAGIKAN KARTU' terlebih dahulu untuk memulai!");
                return;
              }
              stand();
            }}
          >
            STAND (CUKUP)
          </button>
          <button
            id="bj-double-btn"
            className="btn-pixel btn-coin"
            type="button"
            disabled={!gameInProgress || playerHand.length !== 2 || wallet.getBalance() < currentBet}
            onClick={() => {
              if (!gameInProgress) {
                showToast("Tekan 'BAGIKAN KARTU' terlebih dahulu untuk memulai!");
                return;
              }
              doubleDown();
            }}
          >
            DOUBLE (2X)
          </button>
        </div>

        <div className="slot-controls">
          <div className="bet-selector" role="group" aria-label="Pilihan Chip Blackjack">
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-coin)', fontFamily: 'var(--font-pixel)' }}>
              CHIP:
            </span>
            {[10, 25, 50, 100].map(val => (
              <button
                key={val}
                className={`bet-btn bj-chip-btn ${currentBet === val ? 'active' : ''}`}
                type="button"
                disabled={gameInProgress}
                onClick={() => handleChipClick(val)}
              >
                {val}
              </button>
            ))}
          </div>

          <button
            id="bj-deal-btn"
            className={`btn-pixel btn-coin ${!gameInProgress ? 'pulse-btn' : ''}`}
            type="button"
            disabled={gameInProgress}
            onClick={startRound}
          >
            BAGIKAN KARTU 🎴
          </button>
        </div>
      </div>
    </section>
  );
}
