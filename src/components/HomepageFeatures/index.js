import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.greeting}>Hey there! 👋</span>
        <h1 className={styles.heroTitle}>
          I'm <span className={styles.name}>Abishek</span>, a developer who loves building things and sharing knowledge
        </h1>
        <p className={styles.heroSubtitle}>
          Welcome to my corner of the internet where I write about technology, share my learning journey, 
          and document the random thoughts that cross my mind.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/blog" className={styles.primaryButton}>
            Read the Blog
            <ArrowIcon />
          </Link>
          <a href="https://abishekn.com.np" target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
            View Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}

const topics = [
  {
    emoji: "💻",
    title: "Tech & Development",
    description: "Deep dives into programming concepts, tutorials, and my experiences with different technologies."
  },
  {
    emoji: "📚",
    title: "Learning Notes",
    description: "Documenting what I learn about databases, distributed systems, and software architecture."
  },
  {
    emoji: "🌍",
    title: "Life & Travel",
    description: "Personal stories, travel experiences, and reflections on life beyond the keyboard."
  }
];

function TopicsSection() {
  return (
    <section className={styles.topics}>
      <div className={styles.topicsContainer}>
        <h2 className={styles.sectionTitle}>What I Write About</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic, index) => (
            <div key={index} className={styles.topicCard}>
              <span className={styles.topicEmoji}>{topic.emoji}</span>
              <h3 className={styles.topicTitle}>{topic.title}</h3>
              <p className={styles.topicDescription}>{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestPostsCTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to dive in?</h2>
          <p className={styles.ctaText}>
            Explore my latest articles on distributed databases, development workflows, 
            and everything in between.
          </p>
        </div>
        <Link to="/blog" className={styles.ctaButton}>
          Browse All Posts
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <main>
      <HeroSection />
      <TopicsSection />
      <LatestPostsCTA />
    </main>
  );
}
