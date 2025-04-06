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
  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          showReadingTime: true,
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          path: "blog",
          routeBasePath: "blog",
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
      },
    ],
  ],
  themeConfig: {
    image: "img/social-card.jpg",
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
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/virtualabishek",
            },
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
    },
    metadata: [
      {
        name: "google-fonts",
        content: "Inter:400,500,600,700|Calistoga",
      },
    ],
  },
};

export default config;
