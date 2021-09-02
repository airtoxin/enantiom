import { VoidFunctionComponent } from "react";
import { GetStaticProps } from "next";
import { Image, Layout, List } from "antd";
import { join } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "./AppLayout";
import { State } from "../State";

const { Content } = Layout;

const HomePage: VoidFunctionComponent<{ state: State }> = ({ state }) => {
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
        <List>
          {state.results.map((result) => (
            <List.Item key={result.timestamp}>
              <Image
                preview
                src={result.screenshots[0]!.filepath}
                {...result.screenshots[0]!.config.size}
              />
            </List.Item>
          ))}
        </List>
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

export default HomePage;
