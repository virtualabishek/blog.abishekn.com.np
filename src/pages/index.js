import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Personal blog by Abishek Neupane - Writing about technology, software development, databases, and life experiences."
    >
      <HomepageFeatures />
    </Layout>
  );
}
