import React, { useState } from 'react';
import { ArcadeHeader } from '../components/arcade/ArcadeHeader.jsx';
import { SlotMachine } from '../components/arcade/SlotMachine.jsx';
import { Blackjack } from '../components/arcade/Blackjack.jsx';
import { HighLow } from '../components/arcade/HighLow.jsx';
import { PersonalStats } from '../components/arcade/PersonalStats.jsx';
import { sound } from '../services/audio.js';

export function ArcadePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('stage-slot');

  const handleTabClick = (tabId) => {
    sound.playClick();
    setActiveTab(tabId);
    setTimeout(() => {
      const stage = document.getElementById(tabId);
      if (stage) {
        const header = document.querySelector('.arcade-header');
        const headerHeight = header ? header.getBoundingClientRect().height : 100;
        const stagePos = stage.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, stagePos - headerHeight - 20),
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  return (
    <div className="arcade-body">
      <ArcadeHeader onNavigate={onNavigate} />

      <main className="container">
        <section className="arcade-lobby" aria-labelledby="lobby-title">
          <h1 id="lobby-title" className="lobby-heading font-pixel">LOBBY MESIN ARCADE</h1>
          <p className="lobby-sub">Pilih salah satu mesin game di bawah ini untuk mulai bermain</p>

          <div className="game-cards-grid" role="region" aria-label="Daftar Pilihan Game">
            <article
              className={`game-select-card ${activeTab === 'stage-slot' ? 'active' : ''}`}
              tabIndex={0}
              role="button"
              aria-label="Pilih Game Mesin Slot TTW"
              onClick={() => handleTabClick('stage-slot')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabClick('stage-slot');
                }
              }}
            >
              <span className="badge-retro badge-red game-card-badge">POPULER</span>
              <div className="game-card-icon">🎰</div>
              <h2 className="game-card-name font-pixel">MESIN SLOT TTW</h2>
              <p className="game-card-desc">Putar 3 gulungan simbol kampus dan rebut Jackpot TTW hingga 50x lipat!</p>
              <span className="btn-pixel btn-cyan" style={{ fontSize: '0.65rem', padding: '0.4rem 0.8rem' }}>
                MAINKAN SLOT
              </span>
            </article>

            <article
              className={`game-select-card ${activeTab === 'stage-blackjack' ? 'active' : ''}`}
              tabIndex={0}
              role="button"
              aria-label="Pilih Game Blackjack 21"
              onClick={() => handleTabClick('stage-blackjack')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabClick('stage-blackjack');
                }
              }}
            >
              <span className="badge-retro badge-green game-card-badge">FAVORIT</span>
              <div className="game-card-icon">🃏</div>
              <h2 className="game-card-name font-pixel">BLACKJACK 21</h2>
              <p className="game-card-desc">Tantang dealer meja kartu! Dekati nilai 21 dengan Hit, Stand, atau Double.</p>
              <span className="btn-pixel btn-cyan" style={{ fontSize: '0.65rem', padding: '0.4rem 0.8rem' }}>
                MAINKAN KARTU
              </span>
            </article>

            <article
              className={`game-select-card ${activeTab === 'stage-highlow' ? 'active' : ''}`}
              tabIndex={0}
              role="button"
              aria-label="Pilih Game Tebak High-Low"
              onClick={() => handleTabClick('stage-highlow')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabClick('stage-highlow');
                }
              }}
            >
              <span className="badge-retro badge-coin game-card-badge">BARU</span>
              <div className="game-card-icon">🎲</div>
              <h2 className="game-card-name font-pixel">TEBAK HIGH-LOW</h2>
              <p className="game-card-desc">Tebak kartu berikutnya lebih tinggi atau lebih rendah untuk melipatgandakan streak.</p>
              <span className="btn-pixel btn-cyan" style={{ fontSize: '0.65rem', padding: '0.4rem 0.8rem' }}>
                MAINKAN TEBAKAN
              </span>
            </article>
          </div>
        </section>

        <div className="game-stage-container">
          <SlotMachine isActive={activeTab === 'stage-slot'} />
          <Blackjack isActive={activeTab === 'stage-blackjack'} />
          <HighLow isActive={activeTab === 'stage-highlow'} />
          <PersonalStats />
        </div>
      </main>
    </div>
  );
}
