import React, { useState } from 'react';
import membersData from '../../data/members.json';
import { MemberModal } from './MemberModal.jsx';
import { sound } from '../../services/audio.js';

export function MembersSection() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [clickedId, setClickedId] = useState(null);

  const handleSelect = (member) => {
    sound.playClick();
    setClickedId(member.id);
    // Open detail modal immediately with smooth entry animation
    setSelectedMember(member);
    setTimeout(() => setClickedId(null), 300);
  };

  const row1 = membersData.slice(0, 3);
  const row2 = membersData.slice(3, 6);
  const row3 = membersData.slice(6, 10);

  const renderCard = (m, isWide = false) => (
    <div
      key={m.id}
      className={`member-card ${isWide ? 'member-card-wide' : 'member-card-top'} ${clickedId === m.id ? 'is-clicked' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`Lihat profil ${m.nama} - ${m.julukan}`}
      onClick={() => handleSelect(m)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(m);
        }
      }}
    >
      <div className="member-poster-frame">
        <img
          src={m.foto}
          alt={`Poster buronan ${m.nama}`}
          className="member-poster-img"
          loading="lazy"
        />
        <img
          src="/wooden_frame_portrait.png"
          alt=""
          className="member-frame-overlay"
          aria-hidden="true"
        />
      </div>
    </div>
  );

  return (
    <section id="members" className="members-section" aria-labelledby="members-heading">
      <div className="container container-roster">
        <div className="section-title-wrap members-title-wrap">
          <h2 id="members-heading" className="fighter-select-ultimate-title">
            CHOOSE YOUR FIGHTER
          </h2>
        </div>
        
        <div id="members-roster-arena" className="members-roster-arena" role="region" aria-label="Daftar Anggota TTW - Choose Your Fighter">
          {/* Baris 1: 3 kartu */}
          <div className="members-row-3col">
            {row1.map((m) => renderCard(m, false))}
          </div>

          {/* Baris 2: 3 kartu */}
          <div className="members-row-3col">
            {row2.map((m) => renderCard(m, false))}
          </div>

          {/* Baris 3: 4 kartu (Lebih lebar dari 3 di atasnya) */}
          <div className="members-row-4col">
            {row3.map((m) => renderCard(m, true))}
          </div>
        </div>
      </div>

      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </section>
  );
}
