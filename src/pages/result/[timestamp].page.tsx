import { VoidFunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { join } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "../AppLayout";
import { Layout, List } from "antd";
import { State } from "../../State";

const { Content } = Layout;

export const ResultPage: VoidFunctionComponent<{
  state: State;
  timestamp: string;
}> = ({ state, timestamp }) => {
  return (
    <AppLayout state={state}>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <List>{timestamp}</List>
      </Content>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const rawFile = await fs.readFile(
    join(process.cwd(), "public/assets/state.json"),
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

export const getStaticPaths: GetStaticPaths = async () => {
  const rawFile = await fs.readFile(
    join(process.cwd(), "public/assets/state.json"),
    {
      encoding: "utf-8",
    }
  );
  const state = State.parse(JSON.parse(rawFile));

  return {
    paths: state.results.map((result) => ({
      params: { timestamp: result.timestamp },
    })),
    fallback: false,
  };
};

export default ResultPage;
