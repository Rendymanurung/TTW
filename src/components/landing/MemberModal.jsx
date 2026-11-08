import React, { useEffect, useRef } from 'react';

export function MemberModal({ member, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (member && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      id="member-modal"
      className="retro-modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-label="Detail Anggota"
      onClick={onClose}
    >
      <div className="retro-modal-box member-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          id="member-modal-close"
          className="retro-modal-close"
          type="button"
          aria-label="Tutup Dialog"
          onClick={onClose}
        >
          ✕
        </button>

        <div id="member-modal-content" className="member-detail-content">
          <div className="modal-anim-header">
            <div
              className="member-modal-avatar"
              style={{
                borderColor: member.avatar_color,
                boxShadow: `0 0 20px ${member.avatar_color}66, 4px 4px 0 #000`
              }}
            >
              {member.foto ? (
                <img src={member.foto} alt={`Foto buronan ${member.nama}`} className="member-avatar-img" />
              ) : (
                member.avatar_symbol
              )}
            </div>
            <h3 className="member-modal-name">
              {member.nama} ({member.panggilan})
            </h3>
            <p className="member-modal-class">
              {member.julukan} | {member.kelas}
            </p>
          </div>

          <div className="modal-anim-facts member-modal-block">
            <p className="member-modal-label">
              FAKTA UNIK:
            </p>
            <p className="member-modal-fact-text">
              {member.fakta}
            </p>
          </div>

          <div className="modal-anim-stats member-modal-block">
            <p className="member-modal-label">
              STATISTIK TEMPUR:
            </p>
            <div className="modal-stat-line">
              <span>Begadang:</span>
              <div className="modal-stat-track">
                <div className="modal-stat-fill" style={{ width: `${member.statistik.begadang}%` }} />
              </div>
              <span className="modal-stat-val">{member.statistik.begadang}%</span>
            </div>
            <div className="modal-stat-line">
              <span>Ngoding:</span>
              <div className="modal-stat-track">
                <div className="modal-stat-fill" style={{ width: `${member.statistik.ngoding}%` }} />
              </div>
              <span className="modal-stat-val">{member.statistik.ngoding}%</span>
            </div>
            <div className="modal-stat-line">
              <span>Hoki:</span>
              <div className="modal-stat-track">
                <div className="modal-stat-fill" style={{ width: `${member.statistik.hoki}%` }} />
              </div>
              <span className="modal-stat-val">{member.statistik.hoki}%</span>
            </div>
            <div className="modal-stat-line">
              <span>Tahan Banting:</span>
              <div className="modal-stat-track">
                <div className="modal-stat-fill" style={{ width: `${member.statistik.tahan_banting}%` }} />
              </div>
              <span className="modal-stat-val">{member.statistik.tahan_banting}%</span>
            </div>
          </div>

          <div className="modal-anim-quote member-modal-quote-wrap">
            <span className="member-modal-quote-label">
              Quote Khas:
            </span>
            <blockquote className="member-modal-quote">
              "{member.quote}"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
