import { VoidFunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { join } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "../AppLayout";
import {
  Card,
  Col,
  Empty,
  Image,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { Result, State } from "../../State";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { formatTimestamp } from "../../utils";

const { Text, Link } = Typography;
const { Content } = Layout;

type Props = {
  state: State;
  result: Result;
  links: { newer: string | null; older: string | null };
};
export const ResultPage: VoidFunctionComponent<Props> = ({
  state,
  result,
  links,
}) => {
  return (
    <AppLayout state={state}>
      <Row justify="space-between" style={{ padding: 16 }}>
        <Col>
          {links.newer && (
            <Link href={`/result/${links.newer}`}>
              <LeftOutlined />
              {formatTimestamp(links.newer)}
            </Link>
          )}
        </Col>
        <Col>
          {links.older && (
            <Link href={`/result/${links.older}`}>
              {formatTimestamp(links.older)}
              <RightOutlined />
            </Link>
          )}
        </Col>
      </Row>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Image.PreviewGroup>
          {result.screenshots.map((screenshot) => (
            <Card
              key={screenshot.hash}
              bordered={false}
              style={{ marginBottom: "1rem" }}
              title={
                <Space>
                  <Text strong>{screenshot.config.url}</Text>
                  <Tag color="magenta">{screenshot.config.browser}</Tag>
                  <Tag color="cyan">
                    {screenshot.config.size.width}x
                    {screenshot.config.size.height}
                  </Tag>
                </Space>
              }
            >
              <Card.Grid hoverable={false}>
                <Image src={screenshot.filepath.slice(6)} />
              </Card.Grid>
              <Card.Grid hoverable={false}>
                {screenshot.diff ? (
                  <Image src={screenshot.diff.diffFilepath.slice(6)} />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card.Grid>
              <Card.Grid hoverable={false}>
                {screenshot.prevFilepath ? (
                  <Image src={screenshot.prevFilepath.slice(6)} />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card.Grid>
            </Card>
          ))}
        </Image.PreviewGroup>
      </Content>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawFile = await fs.readFile(
    join(process.cwd(), "public/assets/state.json"),
    {
      encoding: "utf-8",
    }
  );
  const state = State.parse(JSON.parse(rawFile));
  const resultIndex = state.results.findIndex(
    (result) => result.timestamp === params?.timestamp
  );
  const result = state.results[resultIndex]!;
  const newer =
    resultIndex === 0 ? null : state.results[resultIndex - 1]!.timestamp;
  const older =
    resultIndex === state.results.length - 1
      ? null
      : state.results[resultIndex + 1]!.timestamp;

  return resultIndex == null
    ? {
        notFound: true,
      }
    : {
        props: {
          state,
          result,
          links: { newer, older },
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
