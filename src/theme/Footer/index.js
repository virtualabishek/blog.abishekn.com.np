import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import ArrowUpRightIcon from "@site/src/components/icons/ArrowUpRightIcon.jsx";
import styles from "./styles.module.css";

const footerLinks = [
  { title: "Github", href: "https://github.com/virtualabishek" },
  { title: "Twitter", href: "https://twitter.com/virtualabishek" },
  { title: "LinkedIn", href: "https://linkedin.com/in/virtualabishek" },
  { title: "Portfolio", href: "https://abishekn.com.np" },
];

export default function Footer() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerWave}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h2 className={styles.title}>{siteConfig.title}</h2>
            <p className={styles.tagline}>{siteConfig.tagline}</p>
          </div>
          <div className={styles.links}>
            {footerLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span>{link.title}</span>
                <ArrowUpRightIcon className={styles.linkIcon} />
              </a>
            ))}
          </div>
        </div>
        <div className={styles.copyright}>
          <span>
            © {new Date().getFullYear()} {siteConfig.title}
          </span>
          <span className={styles.builtWith}>
            Built with <span className={styles.heart}>❤️</span> using Docusaurus
          </span>
        </div>
      </div>
    </footer>
  );
}
