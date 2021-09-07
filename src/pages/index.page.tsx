import { useMemo, VoidFunctionComponent } from "react";
import { GetStaticProps } from "next";
import { Layout, Statistic, Card, Row, Col } from "antd";
import { resolve } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "./AppLayout";
import { State } from "../State";
import Head from "next/head";

const { Content } = Layout;

const HomePage: VoidFunctionComponent<{ state: State }> = ({ state }) => {
  const counts = useMemo(() => {
    const total = state.results.length;
    const success = state.results.filter((r) =>
      r.screenshots.every((s) => s.diff == null)
    ).length;
    const failure = total - success;
    return { total, success, failure };
  }, [state.results]);

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
      >
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic title="Total results" value={counts.total} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Success results"
                value={counts.success}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Failure results"
                value={counts.failure}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
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
