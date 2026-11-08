import React, { useState, useEffect } from 'react';
import { wallet } from '../../services/wallet.js';

export function PersonalStats() {
  const [stats, setStats] = useState(wallet.getStats());

  useEffect(() => {
    const handleUpdate = () => {
      setStats(wallet.getStats());
    };

    window.addEventListener('ttw-wallet-updated', handleUpdate);
    return () => window.removeEventListener('ttw-wallet-updated', handleUpdate);
  }, []);

  return (
    <div className="arcade-stats-bar" role="region" aria-label="Statistik Pribadi Pemain">
      <div>
        <span className="stat-item-label">TOTAL PERMAINAN</span>
        <span id="stat-total-played" className="stat-item-val">{stats.totalPlayed.toLocaleString('id-ID')}</span>
      </div>
      <div>
        <span className="stat-item-label">TOTAL KEMENANGAN</span>
        <span id="stat-total-won" className="stat-item-val">{stats.totalWon.toLocaleString('id-ID')}</span>
      </div>
      <div>
        <span className="stat-item-label">REKOR SALDO TERTINGGI</span>
        <span id="stat-highest-balance" className="stat-item-val">{stats.highestBalance.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}
