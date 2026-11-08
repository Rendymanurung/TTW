import React, { useState, useEffect } from 'react';
import { wallet } from '../../services/wallet.js';
import { sound } from '../../services/audio.js';
import { showToast } from '../../services/toast.js';
import { SlotSymbolIcon } from './SlotSymbolIcon.jsx';
import { PayoutTableModal } from './PayoutTableModal.jsx';

const SYMBOL_LIST = [
  { id: 'seven', label: '777 Flame', payout: 50000 },
  { id: 'bar', label: 'BAR', payout: 10000 },
  { id: 'purple_guy', label: 'Purple Bruiser', payout: 3000 },
  { id: 'blonde_girl', label: 'Shannon', payout: 3000 },
  { id: 'red_midget', label: 'Mad Midget', payout: 3000 },
  { id: 'green_mask', label: 'Gorilla Mask', payout: 3000 }
];

// God Hand Casino 3-Reel Strips (24 symbols per reel, realistic casino distribution)
// No duplicate adjacent symbols on any reel; rare 7s and BARs spaced out.
const REEL_STRIP_0 = [
  'seven', 'purple_guy', 'blonde_girl', 'red_midget', 'green_mask', 'bar',
  'purple_guy', 'blonde_girl', 'red_midget', 'green_mask', 'bar', 'purple_guy',
  'blonde_girl', 'red_midget', 'green_mask', 'purple_guy', 'blonde_girl', 'red_midget',
  'green_mask', 'purple_guy', 'blonde_girl', 'red_midget', 'green_mask', 'blonde_girl'
];

const REEL_STRIP_1 = [
  'green_mask', 'purple_guy', 'bar', 'blonde_girl', 'red_midget', 'green_mask',
  'purple_guy', 'blonde_girl', 'seven', 'red_midget', 'green_mask', 'purple_guy',
  'blonde_girl', 'red_midget', 'green_mask', 'purple_guy', 'blonde_girl', 'bar',
  'red_midget', 'green_mask', 'purple_guy', 'blonde_girl', 'red_midget', 'green_mask'
];

const REEL_STRIP_2 = [
  'red_midget', 'blonde_girl', 'green_mask', 'purple_guy', 'red_midget', 'blonde_girl',
  'green_mask', 'bar', 'purple_guy', 'red_midget', 'blonde_girl', 'green_mask',
  'purple_guy', 'red_midget', 'seven', 'blonde_girl', 'green_mask', 'purple_guy',
  'red_midget', 'blonde_girl', 'bar', 'purple_guy', 'blonde_girl', 'green_mask'
];

const getReelWindow = (strip) => {
  const stopIndex = Math.floor(Math.random() * strip.length);
  return [
    strip[stopIndex],
    strip[(stopIndex + 1) % strip.length],
    strip[(stopIndex + 2) % strip.length]
  ];
};

export function SlotMachine({ isActive }) {
  // Bet Level: 1 (1 Line), 2 (3 Lines), 3 (5 Lines)
  const [betLevel, setBetLevel] = useState(3);
  const coinPerBet = 100;
  const currentTotalBet = betLevel * coinPerBet;

  // 3x3 Visible Grid: grid[row][col] matching original God Hand layout
  const [grid, setGrid] = useState([
    ['blonde_girl', 'seven', 'green_mask'],
    ['red_midget', 'blonde_girl', 'purple_guy'],
    ['bar', 'bar', 'blonde_girl']
  ]);

  const [spinningCol, setSpinningCol] = useState([false, false, false]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  const [winningLines, setWinningLines] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Only players are winners! Good luck!!');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [balance, setBalance] = useState(wallet.getBalance());

  useEffect(() => {
    const handleWallet = (e) => setBalance(e.detail.balance);
    window.addEventListener('ttw-wallet-updated', handleWallet);
    return () => window.removeEventListener('ttw-wallet-updated', handleWallet);
  }, []);

  const handleBetChange = (newLevel) => {
    if (isSpinning) return;
    sound.playClick();
    setBetLevel(newLevel);
    setWinningLines([]);
    setStatusMessage(`BET: ${newLevel} COIN (${newLevel === 1 ? '1 LINE' : newLevel === 2 ? '3 LINES' : '5 ALL LINES'})`);
  };

  const spin = () => {
    if (isSpinning) return;

    if (wallet.getBalance() < currentTotalBet) {
      sound.playBuzzer();
      setStatusMessage('SALDO KOIN TIDAK CUKUP!');
      showToast('Saldo koin habis. Klaim bonus harian atau reset saldo.');
      return;
    }

    wallet.deductCoins(currentTotalBet);
    setIsSpinning(true);
    setWinningLines([]);
    setStatusMessage('SPINNING THE REELS...');

    // Pull the mechanical lever animation
    setIsLeverPulled(true);
    sound.playSpinTick();
    setTimeout(() => setIsLeverPulled(false), 300);

    setSpinningCol([true, true, true]);

    // Spin 3 physical reel strips independently
    const col0 = getReelWindow(REEL_STRIP_0);
    const col1 = getReelWindow(REEL_STRIP_1);
    const col2 = getReelWindow(REEL_STRIP_2);

    // Visible 3x3 grid: [row0, row1, row2]
    const finalGrid = [
      [col0[0], col1[0], col2[0]],
      [col0[1], col1[1], col2[1]],
      [col0[2], col1[2], col2[2]]
    ];

    let ticks = 0;
    const tickInterval = setInterval(() => {
      sound.playSpinTick();
      ticks++;
      if (ticks > 12) clearInterval(tickInterval);
    }, 100);

    // Stop reels column by column
    setTimeout(() => {
      setGrid(prev => [
        [finalGrid[0][0], prev[0][1], prev[0][2]],
        [finalGrid[1][0], prev[1][1], prev[1][2]],
        [finalGrid[2][0], prev[2][1], prev[2][2]]
      ]);
      setSpinningCol(prev => [false, prev[1], prev[2]]);
      sound.playCard();
    }, 800);

    setTimeout(() => {
      setGrid(prev => [
        [finalGrid[0][0], finalGrid[0][1], prev[0][2]],
        [finalGrid[1][0], finalGrid[1][1], prev[1][2]],
        [finalGrid[2][0], finalGrid[2][1], prev[2][2]]
      ]);
      setSpinningCol(prev => [false, false, prev[2]]);
      sound.playCard();
    }, 1300);

    setTimeout(() => {
      setGrid(finalGrid);
      setSpinningCol([false, false, false]);
      setIsSpinning(false);
      evaluateResults(finalGrid);
    }, 1800);
  };

  const evaluateResults = (finalGrid) => {
    // 5 Paylines definitions:
    // Line 1: Middle horizontal [1,0], [1,1], [1,2] (Active on Bet >= 1)
    // Line 2: Top horizontal [0,0], [0,1], [0,2] (Active on Bet >= 2)
    // Line 3: Bottom horizontal [2,0], [2,1], [2,2] (Active on Bet >= 2)
    // Line 4: Diagonal top-left to bot-right [0,0], [1,1], [2,2] (Active on Bet === 3)
    // Line 5: Diagonal bot-left to top-right [2,0], [1,1], [0,2] (Active on Bet === 3)

    const paylines = [
      { id: 1, name: 'Center', active: betLevel >= 1, row: 1, items: [finalGrid[1][0], finalGrid[1][1], finalGrid[1][2]] },
      { id: 2, name: 'Top', active: betLevel >= 2, row: 0, items: [finalGrid[0][0], finalGrid[0][1], finalGrid[0][2]] },
      { id: 3, name: 'Bottom', active: betLevel >= 2, row: 2, items: [finalGrid[2][0], finalGrid[2][1], finalGrid[2][2]] },
      { id: 4, name: 'Diag 1', active: betLevel >= 3, diag: 'down', items: [finalGrid[0][0], finalGrid[1][1], finalGrid[2][2]] },
      { id: 5, name: 'Diag 2', active: betLevel >= 3, diag: 'up', items: [finalGrid[2][0], finalGrid[1][1], finalGrid[0][2]] }
    ];

    let totalWin = 0;
    const hits = [];

    paylines.forEach(line => {
      if (!line.active) return;
      const [a, b, c] = line.items;
      if (a === b && b === c) {
        const sym = SYMBOL_LIST.find(s => s.id === a);
        if (sym) {
          totalWin += sym.payout;
          hits.push({ lineId: line.id, symId: a, payout: sym.payout });
        }
      }
    });

    if (totalWin > 0) {
      wallet.addCoins(totalWin, true);
      sound.playWin();
      setWinningLines(hits.map(h => h.lineId));

      const has777 = hits.some(h => h.symId === 'seven');
      if (has777) {
        setStatusMessage(`JACKPOT 777! +${totalWin.toLocaleString('id-ID')} GOLD!`);
      } else {
        setStatusMessage(`STAGE CLEAR! +${totalWin.toLocaleString('id-ID')} GOLD WIN!`);
      }
      showToast(`MENANG BESAR! +${totalWin.toLocaleString('id-ID')} Gold`);
    } else {
      // Check for near-miss (2 of 3 matching on active paylines)
      const hasNearMiss = paylines.some(line => {
        if (!line.active) return false;
        const [a, b, c] = line.items;
        return (a === b || b === c || a === c);
      });

      sound.playBuzzer();
      if (hasNearMiss) {
        setStatusMessage('FEVER REACH! So close!! Try again!!');
      } else {
        setStatusMessage('Only players are winners! Try again!!');
      }
    }
  };

  // Keyboard shortcut Space = Spin, P = Payout Table
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        spin();
      }
      if (e.key.toLowerCase() === 'p' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setIsPayoutModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <section id="stage-slot" className={`game-screen-panel ${isActive ? 'active' : ''}`} aria-labelledby="godhand-slot-title">
      <h2 id="godhand-slot-title" className="sr-only">God Hand Casino Retro Slot Machine</h2>

      {/* GOD HAND CABINET FRAME (Matching Image 1) */}
      <div className="godhand-cabinet">
        
        {/* TOP ORNATE HEADER */}
        <div className="godhand-top-header">
          {/* Left Emblem: 777 BIG CHANCE */}
          <div className="godhand-emblem-left">
            <div className="big-chance-numbers">777</div>
            <div className="big-chance-banner">BIG CHANCE</div>
          </div>

          {/* Center Plaque: 777 Welcome to the Slots! */}
          <div className="godhand-center-plaque">
            <div className="plaque-corner top-left">⚔️</div>
            <div className="plaque-corner top-right">⚔️</div>
            <div className="plaque-corner bottom-left">⚔️</div>
            <div className="plaque-corner bottom-right">⚔️</div>
            <div className="plaque-content">
              <div className="plaque-title-777">7 7 7</div>
              <div className="plaque-subtitle">Welcome to the Slots!</div>
            </div>
          </div>

          {/* Right Display: GOLD LED SCREEN */}
          <div className="godhand-gold-screen" title="Saldo Gold / Koin Anda">
            <span className="gold-num-glow">{balance.toLocaleString('id-ID')}</span>
            <span className="gold-unit-label">GOLD</span>
          </div>
        </div>

        {/* MIDDLE SECTION: PAYLINE TOKENS (LEFT) + 3x3 REELS WINDOW (CENTER) + MECHANICAL LEVER (RIGHT) */}
        <div className="godhand-middle-arena">
          
          {/* Left Column: 5 Payline Indicators Stack */}
          <div className="godhand-paylines-col" aria-label="Payline Indicators">
            <div className={`payline-token token-3 ${betLevel >= 3 ? 'lit' : ''} ${winningLines.includes(2) ? 'win-pulse' : ''}`} title="Payline 3 (Top Horizontal)">
              <span>3</span>
            </div>
            <div className={`payline-token token-2 ${betLevel >= 2 ? 'lit' : ''} ${winningLines.includes(4) ? 'win-pulse' : ''}`} title="Payline 2 (Diagonal Top-Left)">
              <span>2</span>
            </div>
            <div className={`payline-token token-1 ${betLevel >= 1 ? 'lit' : ''} ${winningLines.includes(1) ? 'win-pulse' : ''}`} title="Payline 1 (Center Horizontal)">
              <span>1</span>
            </div>
            <div className={`payline-token token-2 ${betLevel >= 2 ? 'lit' : ''} ${winningLines.includes(5) ? 'win-pulse' : ''}`} title="Payline 2 (Diagonal Bottom-Left)">
              <span>2</span>
            </div>
            <div className={`payline-token token-3 ${betLevel >= 3 ? 'lit' : ''} ${winningLines.includes(3) ? 'win-pulse' : ''}`} title="Payline 3 (Bottom Horizontal)">
              <span>3</span>
            </div>
          </div>

          {/* Center Column: 3x3 Mechanical Slot Window */}
          <div className="godhand-reels-window">
            <div className="reels-inner-frame">
              {/* 3 Drum Columns */}
              {[0, 1, 2].map(colIdx => (
                <div key={colIdx} className={`godhand-drum-col ${spinningCol[colIdx] ? 'drum-spinning' : ''}`}>
                  {[0, 1, 2].map(rowIdx => (
                    <div
                      key={rowIdx}
                      className={`drum-slot-cell ${winningLines.some(l => 
                        (l === 1 && rowIdx === 1) || 
                        (l === 2 && rowIdx === 0) || 
                        (l === 3 && rowIdx === 2) ||
                        (l === 4 && rowIdx === colIdx) ||
                        (l === 5 && rowIdx === (2 - colIdx))
                      ) ? 'cell-winner' : ''}`}
                    >
                      <SlotSymbolIcon type={grid[rowIdx][colIdx]} />
                    </div>
                  ))}
                </div>
              ))}

              {/* Cylindrical Reel 3D Lighting Overlays */}
              <div className="drum-top-shadow" aria-hidden="true" />
              <div className="drum-center-highlight" aria-hidden="true" />
              <div className="drum-bottom-shadow" aria-hidden="true" />
            </div>
          </div>

          {/* Right Column: Physical Slot Machine Lever */}
          <div className="godhand-lever-housing" onClick={spin} role="button" tabIndex={0} title="Klik Lever untuk Memutar!" aria-label="Tarik Lever">
            <div className="lever-track">
              <div className={`lever-stick ${isLeverPulled ? 'pulled' : ''}`}>
                <div className="lever-ball-knob" />
                <div className="lever-shaft" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM MARQUEE BANNER + PAYOUT BUTTON */}
        <div className="godhand-bottom-marquee">
          <div className="marquee-oval-plate">
            <p className="marquee-text font-serif-gold">{statusMessage}</p>
          </div>

          <button
            type="button"
            className="godhand-r1-payout-btn"
            onClick={() => { sound.playClick(); setIsPayoutModalOpen(true); }}
            title="Buka Tabel Pembayaran (R1)"
          >
            <span className="r1-tag">R1</span> PAYOUT
          </button>
        </div>

      </div>

      {/* PS2 STYLE ACTION CONTROLS PANEL */}
      <div className="godhand-controls-dock">
        <div className="bet-buttons-group">
          <span className="control-label font-pixel">BET COINS:</span>
          {[1, 2, 3].map(lvl => (
            <button
              key={lvl}
              type="button"
              className={`btn-pixel bet-pill-btn ${betLevel === lvl ? 'btn-coin' : 'btn-dark'}`}
              onClick={() => handleBetChange(lvl)}
              disabled={isSpinning}
            >
              ▢ BET {lvl} ({lvl * coinPerBet} G)
            </button>
          ))}
        </div>

        <div className="main-actions-group">
          <button
            type="button"
            className="btn-pixel btn-coin spin-main-btn pulse-btn"
            onClick={spin}
            disabled={isSpinning}
          >
            ⬇ PULL LEVER / SPIN [SPASI] 🕹️
          </button>

          <button
            type="button"
            className="btn-pixel btn-cyan"
            onClick={() => { sound.playClick(); setIsPayoutModalOpen(true); }}
          >
            📜 HAITOU HYOU [P]
          </button>
        </div>
      </div>

      {/* POPUP PAYOUT TABLE SHEET (Matching Image 2) */}
      <PayoutTableModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
      />
    </section>
  );
}
