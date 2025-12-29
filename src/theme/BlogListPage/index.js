import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common/internal";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
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
  if (!item?.content) return null;

  const {
    content: BlogPostContent,
    content: { metadata, frontMatter },
  } = item;

  const { title, description, date, formattedDate, permalink, tags, authors } =
    metadata;

  const getAuthorDetails = (author) => {
    if (typeof author === "object") {
      return {
        name: author.name,
        imageUrl: author.imageURL || `https://github.com/${author.name}.png`,
      };
    }
    return {
      name: author,
      imageUrl: `https://github.com/${author}.png`,
    };
  };

  return (
    <article className={styles.blogCard}>
      {/* Main card content */}
      <div className={styles.cardContent}>
        <Link to={permalink} className={styles.cardTitle}>
          <h2>{title}</h2>
        </Link>

        {description && <p className={styles.cardDescription}>{description}</p>}

        <div className={styles.cardMeta}>
          {/* Authors section */}
          {authors && authors.length > 0 && (
            <div className={styles.cardAuthor}>
              {authors.map((author) => {
                const { name, imageUrl } = getAuthorDetails(author);
                return (
                  <div key={name} className={styles.authorInfo}>
                    <img
                      src={imageUrl}
                      alt={name}
                      className={styles.authorAvatar}
                      onError={(e) => {
                        e.target.src = "https://github.com/github.png";
                      }}
                    />
                    <span className={styles.authorName}>{name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Date */}
          {formattedDate && (
            <span className={styles.cardDate}>{formattedDate}</span>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className={styles.cardTags}>
              {tags.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.permalink}
                  className={styles.cardTag}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
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
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
