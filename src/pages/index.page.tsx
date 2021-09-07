import { VoidFunctionComponent } from "react";
import { GetStaticProps } from "next";
import { Layout } from "antd";
import { resolve } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "./AppLayout";
import { State } from "../State";
import Head from "next/head";

const { Content } = Layout;

const HomePage: VoidFunctionComponent<{ state: State }> = ({ state }) => {
  return (
    <AppLayout state={state}>
      <Head>
        <title key="title">enantiom</title>
        <meta property="og:title" content="enantiom" key="og:title" />
      </Head>

      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const rawFile = await fs.readFile(
    resolve(process.cwd(), "public/assets/state.json"),
    {
      encoding: "utf-8",
    }
  );
  const state = State.parse(JSON.parse(rawFile));

  return {
    props: {
      state,
    },
  };
};

export default HomePage;
