import React from 'react';
import { HeroSection } from '../components/landing/HeroSection.jsx';
import { MembersSection } from '../components/landing/MembersSection.jsx';
import { TimelineSection } from '../components/landing/TimelineSection.jsx';
import { GallerySection } from '../components/landing/GallerySection.jsx';
import { ArcadeTeaserSection } from '../components/landing/ArcadeTeaserSection.jsx';
import { Footer } from '../components/Footer.jsx';

export function LandingPage({ onNavigate }) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <MembersSection />
      <TimelineSection />
      <GallerySection />
      <ArcadeTeaserSection onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </main>
  );
}
