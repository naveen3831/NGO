import React from 'react';

const Logo = ({ variant = 'dark', showText = true, size = 42, className = '' }) => {
  const isLight = variant === 'light'; // Light text for dark backgrounds (like hero / left login)
  const textColor = isLight ? '#ffffff' : '#0d5c3a';
  const subTextColor = isLight ? '#e2e8f0' : '#1b6b47';

  return (
    <div className={`ngo-logo-lockup flex items-center gap-3 ${className}`}>
      {/* Handcrafted Vector Emblem Matching the NGO Brand Exactly */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <g id="ngo-emblem">
          {/* Riverbank Green Base */}
          <path
            d="M8 82C22 75 42 76 60 81C76 85 90 82 96 79C94 88 78 92 50 92C22 92 10 88 8 82Z"
            fill="#15803d"
          />

          {/* Lower River Stream (Sky Blue) */}
          <path
            d="M5 75C20 68 40 70 58 76C75 81 88 78 95 72C93 78 78 84 55 83C35 82 18 78 5 75Z"
            fill="#0ea5e9"
          />

          {/* Upper River Stream (Deep Godavari Blue) */}
          <path
            d="M8 68C24 61 46 63 64 70C79 75 90 71 96 66C93 72 79 77 58 76C40 75 22 71 8 68Z"
            fill="#0284c7"
          />

          {/* Left Tree */}
          <path
            d="M26 38L18 52H23L16 64H36L29 52H34L26 38Z"
            fill="#22c55e"
          />
          <rect x="24.5" y="64" width="3" height="7" fill="#15803d" />

          {/* Center Tree (Taller, Rich Forest Green) */}
          <path
            d="M50 20L38 40H44L34 56H41L32 68H68L59 56H66L56 40H62L50 20Z"
            fill="#15803d"
          />
          <rect x="48" y="68" width="4" height="8" fill="#0f5132" />

          {/* Right Tree */}
          <path
            d="M74 36L66 50H71L63 63H84L77 50H82L74 36Z"
            fill="#16a34a"
          />
          <rect x="72.5" y="63" width="3" height="7" fill="#15803d" />

          {/* Small accent seedling / foliage */}
          <circle cx="12" cy="62" r="3" fill="#4ade80" />
          <circle cx="88" cy="61" r="3" fill="#4ade80" />
        </g>
      </svg>

      {showText && (
        <div className="ngo-logo-text flex flex-col leading-tight">
          <span
            style={{ color: textColor }}
            className="font-bold text-[1.05rem] tracking-tight block"
          >
            Godhavari Nadhi
          </span>
          <span
            style={{ color: subTextColor }}
            className="text-[0.78rem] font-semibold tracking-wide block uppercase"
          >
            Paryavarana Parishubratha
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

