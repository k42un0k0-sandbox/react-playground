import React from "react";
import DefaultLayout from "../components/layout/Layout";
import "../styles/globals.css";
import "animate.css";
import "styles/water.css";

import { useRouter } from "next/router";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
function MyApp({ Component, pageProps }) {
  const Layout: React.VFC<{ children: React.ReactNode }> =
    Component.Layout || DefaultLayout;
  const router = useRouter();
  return (
    <Layout>
      <AnimateSharedLayout>
        <AnimatePresence exitBeforeEnter>
          <Component key={router.pathname} {...pageProps} />
        </AnimatePresence>
      </AnimateSharedLayout>
    </Layout>
  );
}

export default MyApp;
