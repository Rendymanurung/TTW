import React from 'react';
import { sound } from '../../services/audio.js';
import { showToast } from '../../services/toast.js';

const STAGES = [
  {
    badge: 'WORLD 1: LEVEL 1',
    heading: 'Inisiasi di Lab Komputer',
    text: 'Sepuluh anak baru tersesat saat install Linux dan menyepakati nama TTW di bawah desingan kipas server kampus.'
  },
  {
    badge: 'WORLD 2: BOSS FIGHT',
    heading: 'Badai UTS Semester Tiga',
    text: 'Menghadapi tumpukan kalkulus dan struktur data. Seluruh anggota dinyatakan selamat tanpa satu pun nilai C.'
  },
  {
    badge: 'WORLD 3: STAGE CLEAR',
    heading: 'Kemenangan Hackathon Kampus',
    text: '36 jam tanpa tidur di arena coding, TTW memboyong trofi piala bergilir dan menghabiskan hadiah untuk makan ayam krispi bersama.'
  },
  {
    badge: 'WORLD 4: BONUS STAGE',
    heading: 'PKL & Magang Lapangan',
    text: 'Menyusup ke dunia kerja nyata, mengumpulkan pundi pengalaman praktis, dan tetap kumpul tiap jumat malam untuk evaluasi.'
  },
  {
    badge: 'WORLD 5: VICTORY ROAD',
    heading: 'Seminar Proposal Lolos 100%',
    text: 'Sepuluh judul skripsi disetujui dewan penguji. Rute jalan lurus menuju podium wisuda terbuka lebar.'
  }
];

export function TimelineSection() {
  const handleStageClick = (stage) => {
    sound.playCoin();
    showToast(`${stage.badge}: ${stage.heading}`);
  };

  return (
    <section id="timeline" className="timeline-section" aria-labelledby="timeline-heading">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-label">WORLD PROGRESS MAP</span>
          <h2 id="timeline-heading" className="section-title">PETA PERJALANAN LEVEL</h2>
        </div>

        <div className="timeline-track">
          {STAGES.map((stage, idx) => (
            <div
              key={idx}
              className="timeline-stage"
              tabIndex={0}
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={() => handleStageClick(stage)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStageClick(stage);
                }
              }}
            >
              <div className="timeline-node" aria-hidden="true" />
              <div className="timeline-card">
                <span className="timeline-badge">{stage.badge}</span>
                <h3 className="timeline-heading">{stage.heading}</h3>
                <p className="timeline-text">{stage.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
