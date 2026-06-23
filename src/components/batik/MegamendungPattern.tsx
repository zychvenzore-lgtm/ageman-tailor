import React from "react";

export const MegamendungPattern: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern
          id="megamendung"
          width="120"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Cloud curves */}
          <path
            d="M 10,40 C 20,25 45,25 55,40 C 65,30 85,30 95,45 C 105,40 115,45 120,50 C 110,60 85,60 75,50 C 65,60 40,60 30,48 C 20,55 10,50 0,45 C 5,42 8,41 10,40 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <path
            d="M 20,40 C 28,30 43,30 50,40 C 58,33 78,33 85,45 C 93,42 101,45 105,48 C 98,55 78,55 70,48 C 60,55 38,55 30,46 C 22,50 18,48 10,45"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.1"
          />
          <path
            d="M 70,10 C 80,-5 105,-5 115,10 C 120,5 120,15 120,20 C 110,30 85,30 75,20 C 65,30 40,30 30,18 C 20,25 10,20 0,15 C 5,12 8,11 10,10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.08"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#megamendung)" />
    </svg>
  );
};
