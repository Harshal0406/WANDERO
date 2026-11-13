import React from 'react';
import { Heart, Compass } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ background: '#090d16', color: '#94a3b8', borderTop: '1px solid #1e293b', marginTop: 'auto', padding: '4.5rem 0 2.25rem' }}>
      <div className="max-w-7xl">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', color: 'white', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                WANDERO
              </span>
              <span style={{ width: '0.45rem', height: '0.45rem', background: '#f59e0b', borderRadius: '50%', display: 'inline-block', marginLeft: '0.15rem' }}></span>
            </div>
            <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Discover places. Find your stay.
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
              A modern hotel discovery, comparison and booking platform that makes finding and reserving the perfect stay simple.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.15rem' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0, fontWeight: 500 }}
                >
                  Explore Stays & Resorts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookings')}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0, fontWeight: 500 }}
                >
                  Retrieve & Manage Bookings
                </button>
              </li>
              <li>
                <span style={{ color: '#94a3b8' }}>Side-by-Side Comparison Tool</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.15rem' }}>
              Platform Engineering
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {['Spring Boot 3', 'Java 21', 'React 18', 'Vite', 'MySQL 8', 'Hibernate JPA', 'JUnit 5 & Mockito', 'Axios'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.75rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <div>© {new Date().getFullYear()} WANDERO Platform. All rights reserved. Concurrency-safe hotel reservations.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
            <span>Built with precision for</span>
            <Heart size={14} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: '#cbd5e1' }}>WANDERO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
