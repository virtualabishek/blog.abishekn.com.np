import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Abi's Blog",
  tagline: "My Thoughts and Technical Writings",
  favicon: "img/favicon.ico",

  // Update these settings for GitHub Pages
  url: "https://blog.abishekn.com.np",
  baseUrl: "/",
  organizationName: "virtualabishek", // GitHub username
  projectName: "blog.abishekn.com.np", // GitHub repo name
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  // Site config
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, // Disable docs since you're only using blog
        blog: {
          showReadingTime: true,
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          path: "blog", // Make sure this points to your blog directory
          routeBasePath: "blog", // This ensures /blog route works
          postsPerPage: 10,
          blogTitle: "Abishek's Blog",
          blogDescription: "My Thoughts and Technical Writings",
          feedOptions: {
            type: ["rss", "atom"],
            copyright: `Copyright © ${new Date().getFullYear()} Abishek Neupane`,
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social-card.jpg",
      navbar: {
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
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/virtualabishek",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/virtualabishek",
              },
              {
                label: "GitHub",
                href: "https://github.com/virtualabishek",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Portfolio",
                href: "https://abishekn.com.np",
              },
              {
                label: "Blog",
                to: "/blog",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Abishek Neupane. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      metadata: [
        {
          name: "google-fonts",
          content: "Inter:400,500,600,700|Calistoga",
        },
      ],
    }),
};

export default config;
