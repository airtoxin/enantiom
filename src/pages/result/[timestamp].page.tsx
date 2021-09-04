import { useMemo, VoidFunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { resolve } from "path";
import { promises as fs } from "fs";
import { AppLayout } from "../AppLayout";
import {
  Col,
  Collapse,
  Empty,
  Image,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { Result, ScreenshotResult, State } from "../../State";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  FileAddTwoTone,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { formatTimestamp, switcher } from "../../utils";

const { Link } = Typography;
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
  const activeScreenshots = useMemo(
    () =>
      result.screenshots
        .filter((s) => s.diff != null)
        .map((s) => `${result.timestamp}_${s.hash}`),
    [result]
  );
  return (
    <AppLayout state={state} timestamp={result.timestamp}>
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
          <Collapse defaultActiveKey={activeScreenshots}>
            {result.screenshots.map((screenshot) => (
              <Collapse.Panel
                key={`${result.timestamp}_${screenshot.hash}`}
                header={
                  <Space>
                    <ResultSummaryIcon screenshot={screenshot} />
                    <Typography.Text strong>
                      {screenshot.config.url}
                    </Typography.Text>
                    <Tag color="magenta">{screenshot.config.browser}</Tag>
                    <Tag color="cyan">
                      {screenshot.config.size.width}x
                      {screenshot.config.size.height}
                    </Tag>
                  </Space>
                }
              >
                <Row>
                  <Col span={8}>
                    <Image src={screenshot.filepath.slice(6)} />
                  </Col>
                  <Col span={8}>
                    {screenshot.diff ? (
                      <Image src={screenshot.diff.diffFilepath.slice(6)} />
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Col>
                  <Col span={8}>
                    {screenshot.prevFilepath ? (
                      <Image src={screenshot.prevFilepath.slice(6)} />
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Col>
                </Row>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Image.PreviewGroup>
      </Content>
    </AppLayout>
  );
};

const ResultSummaryIcon: VoidFunctionComponent<{
  screenshot: ScreenshotResult;
}> = ({ screenshot }) => {
  const resultType =
    screenshot.diff != null
      ? "diff"
      : screenshot.prevFilepath != null
      ? "noDiff"
      : "add";
  return switcher({
    diff: <ExclamationCircleTwoTone twoToneColor="#f5222d" />,
    noDiff: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    add: <FileAddTwoTone twoToneColor="#1890ff" />,
  })(resultType);
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawFile = await fs.readFile(
    resolve(process.cwd(), "public/assets/state.json"),
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
    resolve(process.cwd(), "public/assets/state.json"),
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
