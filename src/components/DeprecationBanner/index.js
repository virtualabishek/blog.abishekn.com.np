import React from "react";
import styles from "./styles.module.css";

export const NEW_BLOG_URL = "https://www.abishekn.com.np/blogs/";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function DeprecationBanner() {
  return (
    <aside
      className={styles.banner}
      role="note"
      aria-label="This blog has moved"
    >
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true">
          ⚠️
        </span>
        <p className={styles.text}>
          <strong>This site is deprecated.</strong> All blogs are now available
          at{" "}
          <a
            className={styles.link}
            href={NEW_BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            www.abishekn.com.np/blogs
          </a>
          .
        </p>
        <a
          className={styles.cta}
          href={NEW_BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read new blogs
          <ArrowIcon />
        </a>
      </div>
    </aside>
  );
}
