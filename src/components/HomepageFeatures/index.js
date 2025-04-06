import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

function HeroSection() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Welcome to My Blog <span className={styles.wave}>✍️</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Hey, I’m Abishek! This is where I write about{" "}
          <span className={styles.highlight}>tech adventures</span>,{" "}
          <span className={styles.highlight}>life moments</span>, and random
          thoughts.
        </p>
        <Link to="/blog" className={styles.heroButton}>
          Dive into the Posts
        </Link>
      </div>
    </section>
  );
}

function AboutBlog() {
  return (
    <section className={styles.about}>
      <div className="container">
        <Heading as="h2" className={styles.aboutTitle}>
          About This Blog
        </Heading>
        <div className={styles.aboutContent}>
          <p>
            This isn’t just another tech blog. Here, you’ll find a mix of{" "}
            <strong>techincal stuffs</strong>, personal{" "}
            <strong>life updates</strong>, and some{" "}
            <strong>non-technical musings</strong>—all straight from my head to
            your screen. Whether I'm doing code, reflecting on life, or sharing
            a random story, this space is my creative outlet.
          </p>
          <p>
            Want to know more about me? Check out my{" "}
            <Link to="https://abishekn.com.np" className={styles.aboutLink}>
              portfolio
            </Link>{" "}
            for the professional stuff. This blog is where I let loose!
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <main>
      <HeroSection />
      <AboutBlog />
    </main>
  );
}
