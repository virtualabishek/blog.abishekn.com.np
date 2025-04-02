import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link"; // Add this import
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import BlogListPageStructuredData from "./StructuredData";
import styles from "./styles.module.css";

function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogPostCard({ item }) {
  if (!item?.content) {
    return null;
  }

  const {
    content: BlogPostContent,
    content: { metadata, frontMatter },
  } = item;

  const { title, description, date, formattedDate, permalink } = metadata;

  const image = frontMatter.image || "/img/default-blog-image.jpg";

  return (
    <article className={styles.blogCard}>
      <Link to={permalink} className={styles.cardLink}>
        <div className={styles.cardImage}>
          <img src={image} alt={title} loading="lazy" />
        </div>
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>{title}</h2>
          {description && (
            <p className={styles.cardDescription}>{description}</p>
          )}
          <div className={styles.cardMeta}>
            {formattedDate && (
              <span className={styles.cardDate}>{formattedDate}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props;

  return (
    <BlogLayout sidebar={sidebar}>
      <section className={styles.blogList}>
        <div className={styles.blogGrid}>
          {items.map((item, index) => (
            <BlogPostCard key={item.content.metadata.permalink} item={item} />
          ))}
        </div>
        <BlogListPaginator metadata={metadata} />
      </section>
    </BlogLayout>
  );
}

export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
