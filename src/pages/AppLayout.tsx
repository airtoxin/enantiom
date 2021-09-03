import { FunctionComponent } from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { State } from "../State";
import { formatTimestamp } from "../utils";

const { Header, Sider } = Layout;

export const AppLayout: FunctionComponent<{
  state: State;
  timestamp?: string;
}> = ({ children, state, timestamp }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          float: "left",
          padding: 0,
          background: "rgba(255, 255, 255, 0.3)",
        }}
      >
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Sider theme={"dark"} width={250} style={{ overflowY: "scroll" }}>
          <Menu theme={"dark"} selectedKeys={timestamp ? [timestamp] : []}>
            {state.results.map((result) => (
              <Menu.Item key={result.timestamp}>
                <Link href={`/result/${result.timestamp}`}>
                  <a>{formatTimestamp(result.timestamp)}</a>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px", overflowY: "scroll" }}>
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
};
