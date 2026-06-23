import React from "react";

export const ParangPattern: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern
          id="parang"
          width="60"
          height="120"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          {/* Parang S-like motif line */}
          <path
            d="M 30,0 C 20,20 10,40 10,60 C 10,80 20,100 30,120 C 40,100 50,80 50,60 C 50,40 40,20 30,0 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <path
            d="M 30,15 C 25,30 20,45 20,60 C 20,75 25,90 30,105 C 35,90 40,75 40,60 C 40,45 35,30 30,15 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.1"
          />
          {/* Inside diamonds/scales */}
          <circle cx="30" cy="60" r="3" fill="currentColor" opacity="0.15" />
          <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.1" />
          <circle cx="30" cy="90" r="1.5" fill="currentColor" opacity="0.1" />
          {/* Side parallel diagonal strokes */}
          <line x1="0" y1="60" x2="15" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          <line x1="45" y1="60" x2="60" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#parang)" />
    </svg>
  );
};
