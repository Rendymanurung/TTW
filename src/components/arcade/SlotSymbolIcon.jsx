import React from 'react';

const SYMBOL_IMG_MAP = {
  seven: '/slot/assets/sym_seven.png',
  bar: '/slot/assets/sym_bar.png',
  blonde_girl: '/slot/assets/sym_blonde.png',
  red_midget: '/slot/assets/sym_midget.png',
  purple_guy: '/slot/assets/sym_purple.png',
  green_mask: '/slot/assets/sym_green.png'
};

export function SlotSymbolIcon({ type, className = '', style = {} }) {
  const src = SYMBOL_IMG_MAP[type] || SYMBOL_IMG_MAP.seven;

  return (
    <img
      src={src}
      alt={type}
      className={`slot-symbol-img ${className}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        userSelect: 'none',
        ...style
      }}
      loading="eager"
      draggable={false}
    />
  );
}
