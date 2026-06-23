"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export const Navbar = () => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    // Sync hash on mount and when hash changes
    const syncHash = () => {
      setActiveHash(window.location.hash || "");
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    
    // Add click handler to listen for hash updates inside Next.js page
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestLink = target.closest("a");
      if (closestLink && closestLink.hash) {
        setActiveHash(closestLink.hash);
      }
    };
    document.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  const links = [
    { name: "COLLECTIONS", href: "/#collections", isHash: true },
    { name: "OUR STORY", href: "/#story", isHash: true },
    { name: "CUSTOMIZE", href: "/customize", isHash: false },
    { name: "BOOK FITTING", href: "/book", isHash: false },
    { name: "TRACK ORDER", href: "/tracker", isHash: false },
  ];

  const checkIsActive = (link: typeof links[0]) => {
    if (link.isHash) {
      const hashOnly = link.href.split("#")[1];
      return pathname === "/" && activeHash === `#${hashOnly}`;
    }
    return pathname === link.href || pathname.startsWith(link.href + "/");
  };

  return (
    <nav className="hidden lg:flex items-center space-x-6 text-[11px] font-bold tracking-widest">
      {links.map((link) => {
        const isActive = checkIsActive(link);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`relative py-1.5 transition-colors duration-300 ${
              isActive
                ? "text-[#CA8A04]"
                : "text-[#0C0A09]/70 hover:text-[#0C0A09]"
            }`}
          >
            {link.name}
            {isActive && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CA8A04] rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
