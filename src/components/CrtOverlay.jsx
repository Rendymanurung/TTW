import React, { useEffect, useState } from 'react';

export function CrtOverlay() {
  const [crtOff, setCrtOff] = useState(() => localStorage.getItem('ttw_crt_off') === 'true');

  useEffect(() => {
    const handleCrtChange = (e) => {
      setCrtOff(e.detail);
    };

    window.addEventListener('ttw-crt-changed', handleCrtChange);
    return () => window.removeEventListener('ttw-crt-changed', handleCrtChange);
  }, []);

  useEffect(() => {
    if (crtOff) {
      document.body.classList.add('crt-off');
    } else {
      document.body.classList.remove('crt-off');
    }
  }, [crtOff]);

  if (crtOff) return null;

  return <div className="crt-overlay" aria-hidden="true" />;
}
