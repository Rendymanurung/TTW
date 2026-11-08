import React, { useState, useEffect, useRef } from 'react';

export function Toast() {
  const [toast, setToast] = useState({ show: false, message: '' });
  const timerRef = useRef(null);

  useEffect(() => {
    const handleToast = (e) => {
      const message = e.detail;
      setToast({ show: true, message });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3200);
    };

    window.addEventListener('ttw-toast', handleToast);
    return () => {
      window.removeEventListener('ttw-toast', handleToast);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      id="retro-toast"
      className={`retro-toast ${toast.show ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}
