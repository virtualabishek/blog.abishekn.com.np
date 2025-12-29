import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Abi's Blog",
  tagline: "My Thoughts and Technical Writings",
  favicon: "img/favicon.ico",
  url: "https://blog.abishekn.com.np",
  baseUrl: "/",
  organizationName: "virtualabishek",
  projectName: "blog.abishekn.com.np",
  deploymentBranch: "gh-pages",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // SEO: Head tags for better search visibility
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "google-site-verification",
        content: "YOUR_GOOGLE_VERIFICATION_CODE", // Add your code here
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          showReadingTime: true,
          readingTime: ({ content, defaultReadingTime }) =>
            defaultReadingTime({ content, options: { wordsPerMinute: 200 } }),
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          path: "blog",
          routeBasePath: "blog",
          postsPerPage: 10,
          blogTitle: "Abishek's Blog",
          blogDescription: "Technical articles, tutorials, and personal thoughts by Abishek Neupane. Topics include distributed databases, software development, and more.",
          onUntruncatedBlogPosts: "ignore",
          feedOptions: {
            type: ["rss", "atom"],
            title: "Abi's Blog",
            description: "Technical articles and personal thoughts by Abishek Neupane",
            copyright: `Copyright © ${new Date().getFullYear()} Abishek Neupane`,
            language: "en",
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        // SEO: Generate sitemap
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        // SEO: Google Tag Manager (uncomment and add your ID)
        // gtag: {
        //   trackingID: 'G-XXXXXXXXXX',
        //   anonymizeIP: true,
        // },
      },
    ],
  ],

  themeConfig: {
    // SEO: Social card image
    image: "img/social-card.jpg",
    
    // SEO: Additional metadata
    metadata: [
      { name: "keywords", content: "blog, programming, technology, databases, software development, distributed systems, Abishek Neupane" },
      { name: "author", content: "Abishek Neupane" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@virtualabishek" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
    ],
    
    navbar: {
      hideOnScroll: false,
      title: "Abishek's Blog",
      logo: {
        alt: "Blog Logo",
        src: "img/navbarLogo.png",
      },
      items: [
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://abishekn.com.np",
          label: "Portfolio",
          position: "right",
        },
        {
          href: "https://github.com/virtualabishek",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    
    footer: {
      style: "dark",
      links: [
        {
          title: "Connect",
          items: [
            { label: "LinkedIn", href: "https://www.linkedin.com/in/virtualabishek" },
            { label: "Twitter", href: "https://twitter.com/virtualabishek" },
            { label: "GitHub", href: "https://github.com/virtualabishek" },
          ],
        },
        {
          title: "More",
          items: [
            { label: "Portfolio", href: "https://abishekn.com.np" },
            { label: "Blog", to: "/blog" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Abishek Neupane. Built with Docusaurus.`,
    },
    
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "yaml", "sql", "php"],
    },
    
    // Better color mode behavior
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    
    // Table of Contents settings
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  },
};

export default config;
