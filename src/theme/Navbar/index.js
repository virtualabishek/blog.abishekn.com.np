import React, { useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from "@docusaurus/theme-common";
import ArrowUpRightIcon from "@site/src/components/icons/ArrowUpRightIcon.jsx";
import styles from "./styles.module.css";

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { siteConfig } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();

  const navItems = [
    { label: "Blog", to: "/blog" },
    { label: "Portfolio", href: "https://abishekn.com.np" },
    { label: "GitHub", href: "https://github.com/virtualabishek" },
  ];

  return (
    <nav
      className={`${styles.navbar} navbar customNavbar ${
        isMenuOpen ? styles.menuOpen : ""
      }`}
      aria-label="Main navigation"
    >
      <div className={styles.navbarContent}>
        <Link to="/" className={styles.navbarBrand}>
          <span className={styles.brandText}>{siteConfig.title}</span>
        </Link>

        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className={`${styles.navItems} ${isMenuOpen ? styles.show : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              href={item.href}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
              {item.href && <ArrowUpRightIcon className={styles.linkIcon} />}
            </Link>
          ))}
          <button
            className={styles.themeToggle}
            onClick={() =>
              setColorMode(colorMode === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            {colorMode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
