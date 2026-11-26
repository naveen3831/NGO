import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Logo = ({ variant = 'dark', showText = true, size = 42, className = '' }) => {
  const isLight = variant === 'light'; // Light text for dark backgrounds (like hero / left login)
  const textColor = isLight ? '#ffffff' : '#064e3b';
  const subTextColor = isLight ? '#d1fae5' : '#0f766e';
  const [customLogo, setCustomLogo] = useState(() => {
    try {
      return localStorage.getItem('ngo_custom_logo') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const syncLogo = () => {
      try {
        setCustomLogo(localStorage.getItem('ngo_custom_logo') || '');
      } catch {}
    };
    window.addEventListener('ngo-logo-updated', syncLogo);

    API.get('/public/content')
      .then((res) => {
        const remoteLogo = res.data?.logoUrl || '';
        setCustomLogo(remoteLogo);
        try {
          localStorage.setItem('ngo_custom_logo', remoteLogo);
        } catch {}
      })
      .catch(() => {});

    return () => window.removeEventListener('ngo-logo-updated', syncLogo);
  }, []);

  return (
    <div className={`ngo-logo-lockup ${className}`}>
      {customLogo ? (
        <img
          src={customLogo}
          alt="Godhavari Nadhi Logo"
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        />
      ) : (
      /* Handcrafted Vector Emblem Matching the Reference Logo */
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ngo-logo-svg"
      >
        <g id="ngo-emblem">
          {/* Outer Pointed Green Arch */}
          <path
            d="M50 7C55 15 80 26 80 54C80 62 77 69 72 74L28 74C23 69 20 62 20 54C20 26 45 15 50 7Z"
            fill="#52b748"
          />

          {/* White Scalloped Inner Dome Cutout */}
          <path
            d="M50 20C53 26 57 32 61 36C65 37 68 41 68 46C72 48 73 54 71 61C69 66 64 70 50 70C36 70 31 66 29 61C27 54 28 48 32 46C32 41 35 37 39 36C43 32 47 26 50 20Z"
            fill="#ffffff"
          />

          {/* Center Forest Green Leaf */}
          <path
            d="M50 31C58 40 61 49 60 57C59 63 55 66 50 67C45 66 41 63 40 57C39 49 42 40 50 31Z"
            fill="#15803d"
          />
          {/* Leaf Center Vein */}
          <path
            d="M50 36V65"
            stroke="#86efac"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Left Sweeping Light-Blue Wave */}
          <path
            d="M7 66C24 61 42 66 58 75C65 79 71 80 76 79C62 84 42 82 24 75C15 71 9 68 7 66Z"
            fill="#38bdf8"
          />

          {/* Right Sweeping Sky-Blue Wave */}
          <path
            d="M93 66C76 61 58 66 42 75C35 79 29 80 24 79C38 84 58 82 76 75C85 71 91 68 93 66Z"
            fill="#0ea5e9"
          />

          {/* Deep Ocean-Blue Lower Water Bowl */}
          <path
            d="M19 76C33 77 45 81 50 84C55 81 67 77 81 76C74 87 63 93 50 93C37 93 26 87 19 76Z"
            fill="#0284c7"
          />
        </g>
      </svg>
      )}

      {showText && (
        <div className="ngo-logo-text">
          <span
            style={{ color: textColor }}
            className="ngo-logo-title-main"
          >
            Godhavari Nadhi
          </span>
          <span
            style={{ color: subTextColor }}
            className="ngo-logo-title-sub"
          >
            Paryavarana Parishubratha
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
