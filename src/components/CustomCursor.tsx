import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(true);
  
  // Use a ref to animate more smoothly and avoid too frequent React re-renders
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setHidden(false);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    // Add pointer events for interactive things to scale cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-cursor')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Disable default body cursor on desktop
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      document.body.classList.add('custom-cursor-active');
    } else {
      setHidden(true);
      setEnabled(false);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  if (!enabled || hidden) return null;

  return (
    <>
      {/* Coffee Bean Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] -ml-4 -mt-4 transition-transform duration-100 ease-out will-change-transform"
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full transition-transform duration-300 ${
            hovered ? 'scale-150 rotate-45' : 'scale-100'
          } ${clicked ? 'scale-90 rotate-12' : ''}`}
        >
          {/* Coffee Bean Body */}
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="30"
            fill="#6F4E37"
            stroke="#D4A762"
            strokeWidth="3.5"
            transform="rotate(-25 50 50)"
          />
          {/* Bean Center Curve (Crease) */}
          <path
            d="M 12 65 C 25 58, 40 45, 50 50 C 60 55, 75 42, 88 35"
            fill="none"
            stroke="#F8F2EA"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mini control panel in absolute screen corners is avoided, but custom toggler on header could let them disable cursor if they wish */}
    </>
  );
}
