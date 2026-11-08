import React, { useState, useEffect } from 'react';
import { CrtOverlay } from './components/CrtOverlay.jsx';
import { StartOverlay } from './components/StartOverlay.jsx';
import { HudNav } from './components/HudNav.jsx';
import { Toast } from './components/Toast.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { ArcadePage } from './pages/ArcadePage.jsx';
import { wallet } from './services/wallet.js';
import { sound } from './services/audio.js';
import { showToast } from './services/toast.js';

export function App() {
  const getInitialRoute = () => {
    const path = window.location.pathname;
    if (path.includes('arcade')) return 'arcade';
    const hash = window.location.hash;
    if (hash.includes('arcade')) return 'arcade';
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  const navigate = (route) => {
    setCurrentRoute(route);
    if (route === 'arcade') {
      window.location.hash = 'arcade';
    } else {
      window.location.hash = '';
      window.history.pushState({}, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleRouteSync = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  // Memulai musik latar langsung saat masuk web + fallback gesture
  useEffect(() => {
    // 1. Coba mulai lagu langsung seketika
    sound.startBgm();

    // 2. Jika browser memblokir sebelum interaksi, langsung mainkan pada gesture pertama apapun
    const handleFirstGesture = () => {
      sound.startBgm();
      const events = ['click', 'pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'];
      events.forEach(evt => window.removeEventListener(evt, handleFirstGesture, { capture: true }));
    };

    const events = ['click', 'pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'];
    events.forEach(evt => window.addEventListener(evt, handleFirstGesture, { capture: true, once: true }));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleFirstGesture, { capture: true }));
    };
  }, []);

  // Global Konami Code
  useEffect(() => {
    const konamiSeq = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIdx = 0;

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === konamiSeq[konamiIdx].toLowerCase()) {
        konamiIdx++;
        if (konamiIdx === konamiSeq.length) {
          konamiIdx = 0;
          wallet.addCoins(1000, true);
          sound.playWin();
          showToast('RAHASIA TTW TERBUKA: KODE KONAMI DIAKTIFKAN! +1.000 KOIN!');
        }
      } else {
        konamiIdx = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <CrtOverlay />
      {currentRoute === 'landing' && <StartOverlay />}
      <HudNav currentRoute={currentRoute} onNavigate={navigate} />

      {currentRoute === 'landing' ? (
        <LandingPage onNavigate={navigate} />
      ) : (
        <ArcadePage onNavigate={navigate} />
      )}

      <Toast />
    </>
  );
}
