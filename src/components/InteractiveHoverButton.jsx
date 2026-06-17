import React from 'react';
import { ArrowRight } from 'lucide-react';

export function InteractiveHoverButton({
  children,
  className = '',
  onClick,
  style,
  ...props
}) {
  return (
    <button
      className={`interactive-hover-btn ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <div className="interactive-hover-btn-dot"></div>
        <span className="interactive-hover-btn-text-initial">
          {children}
        </span>
      </div>
      <div className="interactive-hover-btn-content-hover">
        <span>{children}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
}
