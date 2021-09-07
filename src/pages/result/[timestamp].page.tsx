import {
  Reducer,
  useCallback,
  useMemo,
  useReducer,
  VoidFunctionComponent,
} from "react";
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
import Head from "next/head";
import Lightbox from "react-image-lightbox";

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
  const [fullSizeImages, dispatch] = useFullSizeImages();
  const activeScreenshots = useMemo(
    () =>
      result.screenshots
        .filter((s) => s.diff != null)
        .map((s) => `${result.timestamp}_${s.hash}`),
    [result]
  );
  const getImages = useCallback(
    (screenshot: ScreenshotResult) =>
      [
        screenshot.filepath.slice(6),
        screenshot.diff?.diffFilepath.slice(6) ?? [],
        screenshot.prevFilepath?.slice(6) ?? [],
      ].flat(),
    []
  );
  return (
    <AppLayout state={state} timestamp={result.timestamp}>
      <Head>
        <title key="title">
          {formatTimestamp(result.timestamp)} | enantiom
        </title>
        <meta
          property="og:title"
          content={`${formatTimestamp(result.timestamp)} | enantiom`}
          key="og:title"
        />
      </Head>

      {fullSizeImages && (
        <Lightbox
          mainSrc={fullSizeImages.images[fullSizeImages.index]!}
          nextSrc={fullSizeImages.next}
          prevSrc={fullSizeImages.prev}
          onMoveNextRequest={() => dispatch({ type: "next" })}
          onMovePrevRequest={() => dispatch({ type: "prev" })}
          onCloseRequest={() => dispatch({ type: "close" })}
        />
      )}

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
                  <Image
                    alt={`Current screenshot of ${result.timestamp}`}
                    src={screenshot.filepath.slice(6)}
                    preview={false}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      dispatch({
                        type: "open",
                        images: getImages(screenshot),
                        index: 0,
                      })
                    }
                  />
                </Col>
                <Col span={8}>
                  {screenshot.diff ? (
                    <Image
                      alt={`Screenshot diff of ${result.timestamp}`}
                      src={screenshot.diff.diffFilepath.slice(6)}
                      preview={false}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch({
                          type: "open",
                          images: getImages(screenshot),
                          index: 1,
                        })
                      }
                    />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Col>
                <Col span={8}>
                  {screenshot.prevFilepath ? (
                    <Image
                      alt={`Previous screenshot of ${result.timestamp}`}
                      src={screenshot.prevFilepath.slice(6)}
                      preview={false}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch({
                          type: "open",
                          images: getImages(screenshot),
                          index: getImages(screenshot).length - 1,
                        })
                      }
                    />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Col>
              </Row>
            </Collapse.Panel>
          ))}
        </Collapse>
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

const useFullSizeImages = () =>
  useReducer<
    Reducer<
      { images: string[]; index: number; next: string; prev: string } | null,
      | { type: "open"; images: string[]; index: number }
      | { type: "close" }
      | { type: "next" }
      | { type: "prev" }
    >
  >((state, action) => {
    switch (action.type) {
      case "open": {
        return {
          ...action,
          next: action.images[(action.index + 1) % action.images.length]!,
          prev: action.images[
            (action.index - 1 + action.images.length) % action.images.length
          ]!,
        };
      }
      case "close": {
        return null;
      }
      case "next": {
        if (state == null) return null;
        const index = (state.index + 1) % state.images.length;
        return {
          ...state,
          index,
          next: state.images[(index + 1) % state.images.length]!,
          prev: state.images[
            (index - 1 + state.images.length) % state.images.length
          ]!,
        };
      }
      case "prev": {
        if (state == null) return null;
        const index =
          (state.index - 1 + state.images.length) % state.images.length;
        return {
          ...state,
          index,
          next: state.images[(index + 1) % state.images.length]!,
          prev: state.images[
            (index - 1 + state.images.length) % state.images.length
          ]!,
        };
      }
    }
  }, null);

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
