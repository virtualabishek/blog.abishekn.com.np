import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from "@docusaurus/theme-common/internal";
import styles from "./styles.module.css";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.externalIcon}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { siteConfig } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      document.addEventListener("click", closeMenu);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("click", closeMenu);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { label: "Blog", to: "/blog" },
    { label: "Portfolio", href: "https://abishekn.com.np", external: true },
    { label: "GitHub", href: "https://github.com/virtualabishek", external: true },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${isMenuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.navbarContent}>
        <Link to="/" className={styles.navbarBrand}>
          <span className={styles.brandIcon}>A</span>
          <span className={styles.brandText}>Abi's Blog</span>
        </Link>

        <div className={`${styles.navItems} ${isMenuOpen ? styles.show : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              href={item.href}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
              {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.label}
              {item.external && <ExternalLinkIcon />}
            </Link>
          ))}
          
          <button
            className={styles.themeToggle}
            onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
          >
            {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      
      {isMenuOpen && <div className={styles.backdrop} onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
}
