import { VoidFunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { join } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "../AppLayout";
import { Image, Layout, List } from "antd";
import { Result, State } from "../../State";

const { Content } = Layout;

export const ResultPage: VoidFunctionComponent<{
  state: State;
  result: Result;
}> = ({ state, result }) => {
  return (
    <AppLayout state={state}>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        {result.screenshots.map((screenshot) => (
          <List key={screenshot.hash}>
            <Image src={screenshot.filepath.slice(6)} width={300} />
            {screenshot.diff && (
              <Image src={screenshot.diff.diffFilepath.slice(6)} width={300} />
            )}
          </List>
        ))}
      </Content>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawFile = await fs.readFile(
    join(process.cwd(), "public/assets/state.json"),
    {
      encoding: "utf-8",
    }
  );
  const state = State.parse(JSON.parse(rawFile));
  const result = state.results.find(
    (result) => result.timestamp === params?.timestamp
  );

  return result == null
    ? {
        notFound: true,
      }
    : {
        props: {
          state,
          result,
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
