import React from 'react';
import { motion } from 'framer-motion';
import pagluConfig from '../../config/pagluConfig';

export default function LoadingScreen({ message = 'Calibrating Celestial Coordinates...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 45%, #120d2b 0%, #050510 55%, #020206 100%)',
        padding: '24px',
        textAlign: 'center'
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ position: 'relative', width: 112, height: 112, marginBottom: 28 }}>
        <div
          className="animate-spin-slow"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1.5px dashed rgba(56, 189, 248, 0.55)'
          }}
        />
        <div
          className="animate-spin-reverse"
          style={{
            position: 'absolute',
            inset: 14,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#a855f7',
            borderBottomColor: '#f472b6'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 34,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 0%, #38bdf8 45%, #8b5cf6 100%)',
            boxShadow: '0 0 28px rgba(56, 189, 248, 0.7)'
          }}
        />
      </div>

      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          letterSpacing: '0.26em',
          color: '#e2e8f0',
          marginBottom: 8
        }}
      >
        {pagluConfig.universeTitle}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-tech)',
          fontSize: '0.8rem',
          letterSpacing: '0.12em',
          color: 'var(--electric-blue)',
          opacity: 0.9
        }}
      >
        {message}
      </p>
    </motion.div>
  );
}
