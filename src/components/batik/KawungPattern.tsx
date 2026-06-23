import React from "react";

export const KawungPattern: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern
          id="kawung"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Main intersecting ellipses */}
          <ellipse
            cx="40"
            cy="40"
            rx="36"
            ry="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="40"
            cy="40"
            rx="18"
            ry="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          {/* Intersecting ones at corners */}
          <ellipse
            cx="0"
            cy="0"
            rx="36"
            ry="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="18"
            ry="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="80"
            cy="0"
            rx="36"
            ry="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="80"
            cy="0"
            rx="18"
            ry="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="0"
            cy="80"
            rx="36"
            ry="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="0"
            cy="80"
            rx="18"
            ry="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="80"
            cy="80"
            rx="36"
            ry="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <ellipse
            cx="80"
            cy="80"
            rx="18"
            ry="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          {/* Core diamond shape in between */}
          <rect x="38" y="38" width="4" height="4" fill="currentColor" opacity="0.25" transform="rotate(45 40 40)" />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.15" />
          <circle cx="60" cy="20" r="2.5" fill="currentColor" opacity="0.15" />
          <circle cx="20" cy="60" r="2.5" fill="currentColor" opacity="0.15" />
          <circle cx="60" cy="60" r="2.5" fill="currentColor" opacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kawung)" />
    </svg>
  );
};
