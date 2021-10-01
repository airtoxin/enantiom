import { VoidFunctionComponent } from "react";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  FileAddTwoTone,
} from "@ant-design/icons";
import { Divider, Space, Switch } from "antd";
import { useResultFilter, useSetResultFilter } from "./ResultFilterContext";

export const ResultFilter: VoidFunctionComponent = () => {
  const { add, diff, noDiff } = useResultFilter();
  const { setAdd, setDiff, setNoDiff } = useSetResultFilter();
  return (
    <Space size="small" style={{ marginLeft: "auto", marginRight: "1rem" }}>
      <FileAddTwoTone twoToneColor="#1890ff" />
      <Switch
        checked={add}
        onChange={setAdd}
        style={{
          backgroundColor: add ? undefined : "rgba(255, 255, 255, 0.25)",
        }}
      />
      <Divider
        type="vertical"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
      />
      <CheckCircleTwoTone twoToneColor="#52c41a" />
      <Switch
        checked={noDiff}
        onChange={setNoDiff}
        style={{
          backgroundColor: noDiff ? undefined : "rgba(255, 255, 255, 0.25)",
        }}
      />
      <Divider
        type="vertical"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
      />
      <ExclamationCircleTwoTone twoToneColor="#f5222d" />
      <Switch
        checked={diff}
        onChange={setDiff}
        style={{
          backgroundColor: diff ? undefined : "rgba(255, 255, 255, 0.25)",
        }}
      />
    </Space>
  );
};
