import React, { useEffect, useRef } from 'react';
import { SlotSymbolIcon } from './SlotSymbolIcon.jsx';

export function PayoutTableModal({ isOpen, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="retro-modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-label="Tabel Pembayaran Slot"
      onClick={onClose}
      style={{ zIndex: 6000 }}
    >
      <div
        className="godhand-parchment-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="parchment-close-btn"
          onClick={onClose}
          aria-label="Tutup Tabel"
        >
          ✕
        </button>

        {/* Ornate Header */}
        <div className="parchment-header">
          <div className="parchment-flourish">❦ ══════════════ ❦</div>
          <h2 className="parchment-title">配 当 表</h2>
          <div className="parchment-subtitle">GOD HAND CASINO - TABEL PEMBAYARAN</div>
          <div className="parchment-flourish">❦ ══════════════ ❦</div>
        </div>

        {/* Payout Table Rows - 6 Main Symbols */}
        <div className="parchment-table">
          {/* 777 Jackpot */}
          <div className="parchment-row jackpot-row">
            <div className="parchment-symbols">
              <div style={{ width: '85px', height: '55px', overflow: 'hidden' }}>
                <SlotSymbolIcon type="seven" />
              </div>
            </div>
            <div className="parchment-payout font-gold-emboss">
              50000 <span className="gold-unit">G</span>
            </div>
          </div>

          {/* BAR */}
          <div className="parchment-row">
            <div className="parchment-symbols">
              <div style={{ width: '85px', height: '48px', overflow: 'hidden' }}>
                <SlotSymbolIcon type="bar" />
              </div>
            </div>
            <div className="parchment-payout font-gold-emboss">
              10000 <span className="gold-unit">G</span>
            </div>
          </div>

          {/* 4 Characters in 2 Columns */}
          <div className="parchment-grid-2col">
            <div className="parchment-grid-item">
              <div className="item-syms">
                <div style={{ width: '65px', height: '45px', overflow: 'hidden' }}>
                  <SlotSymbolIcon type="purple_guy" />
                </div>
              </div>
              <div className="item-payout">3000 G</div>
            </div>

            <div className="parchment-grid-item">
              <div className="item-syms">
                <div style={{ width: '65px', height: '45px', overflow: 'hidden' }}>
                  <SlotSymbolIcon type="blonde_girl" />
                </div>
              </div>
              <div className="item-payout">3000 G</div>
            </div>

            <div className="parchment-grid-item">
              <div className="item-syms">
                <div style={{ width: '65px', height: '45px', overflow: 'hidden' }}>
                  <SlotSymbolIcon type="red_midget" />
                </div>
              </div>
              <div className="item-payout">3000 G</div>
            </div>

            <div className="parchment-grid-item">
              <div className="item-syms">
                <div style={{ width: '65px', height: '45px', overflow: 'hidden' }}>
                  <SlotSymbolIcon type="green_mask" />
                </div>
              </div>
              <div className="item-payout">3000 G</div>
            </div>
          </div>
        </div>

        {/* PS2 Controller Guide */}
        <div className="parchment-guide">
          <div className="guide-line">
            <span className="ps2-btn-icon sq">▢</span>
            <span className="guide-text">BET (最大三回まで - Maksimal 3 Koin untuk 5 Jalur)</span>
          </div>
          <div className="guide-line">
            <span className="ps2-btn-icon down">RIGHT ⬇</span>
            <span className="guide-text">レバーを引く (Tarik Lever / Tekan Spasi)</span>
          </div>
          <div className="guide-line">
            <span className="ps2-btn-icon cross">✕</span>
            <span className="guide-text">BETキャンセル EXIT (Tutup Tabel - ESC)</span>
          </div>
        </div>

        <button type="button" className="parchment-exit-btn" onClick={onClose}>
          TUTUP [EXIT]
        </button>
      </div>
    </div>
  );
}
