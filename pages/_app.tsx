import React from "react";
import DefaultLayout from "../components/layout/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const Layout: React.VFC<{ children: React.ReactNode }> =
    Component.Layout || DefaultLayout;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
