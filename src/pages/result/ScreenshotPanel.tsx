import { useMemo, VoidFunctionComponent } from "react";
import { Col, Empty, Image, Row, Space, Tag, Collapse, Typography } from "antd";
import { ScreenshotResult } from "../../State";
import { switcher } from "../../utils";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  FileAddTwoTone,
} from "@ant-design/icons";

const { Panel } = Collapse;

export const ScreenshotPanel: VoidFunctionComponent<{
  panelKey: string;
  screenshot: ScreenshotResult;
}> = ({ panelKey, screenshot }) => {
  const resultIcon = useMemo(() => {
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
  }, [screenshot.diff, screenshot.prevFilepath]);

  return (
    <Panel
      collapsible="header"
      key={panelKey}
      header={
        <Space>
          {resultIcon}
          <Typography.Text strong>{screenshot.config.url}</Typography.Text>
          <Tag color="magenta">{screenshot.config.browser}</Tag>
          <Tag color="cyan">
            {screenshot.config.size.width}x{screenshot.config.size.height}
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
    </Panel>
  );
};
