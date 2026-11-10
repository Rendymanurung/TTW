import React, { useState } from 'react';
import { sound } from '../../services/audio.js';
import { StageModal } from './StageModal.jsx';

export const STAGES = [
  {
    id: 1,
    world: 'WORLD 1',
    level: 'LEVEL 1',
    badge: 'WORLD 1: LEVEL 1',
    heading: 'Inisiasi di Lab Komputer',
    text: 'Sepuluh anak baru tersesat saat install Linux dan menyepakati nama TTW di bawah desingan kipas server kampus.',
    foto: '', // Isi path foto dokumentasi di sini (contoh: '/timeline/stage1.jpg')
    icon: '💻'
  },
  {
    id: 2,
    world: 'WORLD 2',
    level: 'BOSS FIGHT',
    badge: 'WORLD 2: BOSS FIGHT',
    heading: 'Badai UTS Semester Tiga',
    text: 'Menghadapi tumpukan kalkulus dan struktur data. Seluruh anggota dinyatakan selamat tanpa satu pun nilai C.',
    foto: '',
    icon: '⚡'
  },
  {
    id: 3,
    world: 'WORLD 3',
    level: 'STAGE CLEAR',
    badge: 'WORLD 3: STAGE CLEAR',
    heading: 'Kemenangan Hackathon Kampus',
    text: '36 jam tanpa tidur di arena coding, TTW memboyong trofi piala bergilir dan menghabiskan hadiah untuk makan ayam krispi bersama.',
    foto: '',
    icon: '🏆'
  },
  {
    id: 4,
    world: 'WORLD 4',
    level: 'BONUS STAGE',
    badge: 'WORLD 4: BONUS STAGE',
    heading: 'PKL & Magang Lapangan',
    text: 'Menyusup ke dunia kerja nyata, mengumpulkan pundi pengalaman praktis, dan tetap kumpul tiap jumat malam untuk evaluasi.',
    foto: '',
    icon: '💼'
  },
  {
    id: 5,
    world: 'WORLD 5',
    level: 'VICTORY ROAD',
    badge: 'WORLD 5: VICTORY ROAD',
    heading: 'Seminar Proposal Lolos 100%',
    text: 'Sepuluh judul skripsi disetujui dewan penguji. Rute jalan lurus menuju podium wisuda terbuka lebar.',
    foto: '',
    icon: '🎓'
  }
];

export function TimelineSection() {
  const [selectedStage, setSelectedStage] = useState(null);

  const handleStageClick = (stage) => {
    sound.playClick();
    setSelectedStage(stage);
  };

  return (
    <section id="timeline" className="timeline-section" aria-labelledby="timeline-heading">
      <div className="container container-timeline-landscape">
        <div className="section-title-wrap">
          <span className="section-label">WORLD PROGRESS MAP</span>
          <h2 id="timeline-heading" className="section-title">PETA PERJALANAN LEVEL</h2>
        </div>

        <div className="timeline-landscape-wrapper">
          <div className="timeline-landscape-track" role="region" aria-label="Peta Level Landscape">
            {STAGES.map((stage, idx) => (
              <div
                key={stage.id}
                className="timeline-landscape-stage"
                tabIndex={0}
                role="button"
                aria-label={`Lihat dokumentasi ${stage.badge} - ${stage.heading}`}
                onClick={() => handleStageClick(stage)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStageClick(stage);
                  }
                }}
              >
                <div className="timeline-node-wrapper">
                  <div className="timeline-landscape-node" aria-hidden="true">
                    <span className="node-num">{idx + 1}</span>
                  </div>
                </div>

                <div className="timeline-landscape-card">
                  <span className="timeline-stage-icon" aria-hidden="true">{stage.icon}</span>
                  <span className="timeline-badge">{stage.badge}</span>
                  <h3 className="timeline-heading">{stage.heading}</h3>
                  <p className="timeline-text">{stage.text}</p>
                  <span className="timeline-cta-hint">📷 KLIK UNTUK LIHAT FOTO</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />
    </section>
  );
}
