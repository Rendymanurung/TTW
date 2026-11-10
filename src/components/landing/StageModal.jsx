import React, { useEffect, useRef } from 'react';

export function StageModal({ stage, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (stage && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, onClose]);

  if (!stage) return null;

  return (
    <div
      id="stage-modal"
      className="retro-modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Level: ${stage.heading}`}
      onClick={onClose}
    >
      <div className="retro-modal-box stage-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          id="stage-modal-close"
          className="retro-modal-close"
          type="button"
          aria-label="Tutup Dialog"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="stage-detail-content">
          <div className="stage-modal-header">
            <span className="badge-retro badge-coin" style={{ marginBottom: '0.65rem' }}>
              {stage.badge}
            </span>
            <h3 className="stage-modal-title">{stage.heading}</h3>
          </div>

          <div className="stage-modal-media-box">
            {stage.foto ? (
              <img
                src={stage.foto}
                alt={`Dokumentasi ${stage.heading}`}
                className="stage-modal-photo"
              />
            ) : (
              <div className="stage-modal-placeholder">
                <div className="placeholder-icon" aria-hidden="true">{stage.icon || '📸'}</div>
                <p className="placeholder-title">FOTO DOKUMENTASI LEVEL</p>
                <p className="placeholder-sub">
                  Slot foto siap digunakan. Masukkan path file foto ke dalam <code>foto</code> di <code>TimelineSection.jsx</code>.
                </p>
              </div>
            )}
          </div>

          <div className="stage-modal-desc-box">
            <span className="stage-modal-label">CATATAN PERJALANAN:</span>
            <p className="stage-modal-text">{stage.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
