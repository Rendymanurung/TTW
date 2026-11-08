import React, { useEffect, useRef } from 'react';

export function GalleryModal({ item, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (item && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      id="gallery-modal"
      className="retro-modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-label="Lightbox Galeri"
      onClick={onClose}
    >
      <div className="retro-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          id="gallery-modal-close"
          className="retro-modal-close"
          type="button"
          aria-label="Tutup Lightbox"
          onClick={onClose}
        >
          ✕
        </button>

        <div id="gallery-modal-content">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{item.pixel_icon}</div>
            <span className="badge-retro badge-coin" style={{ marginBottom: '0.75rem' }}>
              {item.tag}
            </span>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              {item.judul}
            </h3>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
              {item.tanggal} | Kategori: {item.kategori}
            </p>
          </div>
          <div style={{ background: '#0f0d26', padding: '1rem', border: '2px solid var(--accent-cyan)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {item.deskripsi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
