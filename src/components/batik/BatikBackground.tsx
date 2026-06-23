import React from "react";
import { ParangPattern } from "./ParangPattern";
import { KawungPattern } from "./KawungPattern";
import { MegamendungPattern } from "./MegamendungPattern";

interface BatikBackgroundProps {
  pattern: string;
  className?: string;
}

export const BatikBackground: React.FC<BatikBackgroundProps> = ({ pattern, className = "" }) => {
  switch (pattern?.toUpperCase()) {
    case "PARANG":
      return <ParangPattern className={className} />;
    case "KAWUNG":
      return <KawungPattern className={className} />;
    case "MEGAMENDUNG":
      return <MegamendungPattern className={className} />;
    default:
      return null;
  }
};
