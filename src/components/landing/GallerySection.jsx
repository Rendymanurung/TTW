import React, { useState } from 'react';
import galleryData from '../../data/gallery.json';
import { GalleryModal } from './GalleryModal.jsx';
import { sound } from '../../services/audio.js';

const FILTERS = ['all', 'proyek', 'nongkrong', 'wisuda', 'mabar'];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = activeFilter === 'all'
    ? galleryData
    : galleryData.filter(item => item.kategori === activeFilter);

  const handleFilterClick = (f) => {
    sound.playClick();
    setActiveFilter(f);
  };

  const handleCardClick = (item) => {
    sound.playClick();
    setSelectedItem(item);
  };

  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-heading">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-label">MEMORIES & SNAPSHOTS</span>
          <h2 id="gallery-heading" className="section-title">GALERI KEBERSAMAAN</h2>
        </div>

        <div className="gallery-filters" role="group" aria-label="Filter Galeri">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              type="button"
              onClick={() => handleFilterClick(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <div id="gallery-grid" className="gallery-grid" role="region" aria-label="Item Galeri">
          {filteredItems.map((g) => (
            <div
              key={g.id}
              className="gallery-card"
              tabIndex={0}
              role="button"
              aria-label={`Buka foto ${g.judul}`}
              onClick={() => handleCardClick(g)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(g);
                }
              }}
            >
              <div className="gallery-frame">
                <span className="gallery-tag-pill badge-retro badge-cyan">{g.tag}</span>
                <div className="gallery-icon">{g.pixel_icon}</div>
              </div>
              <h4 className="gallery-title">{g.judul}</h4>
              <p className="gallery-date">{g.tanggal}</p>
            </div>
          ))}
        </div>
      </div>

      <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
