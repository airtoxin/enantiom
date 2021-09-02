import { FunctionComponent } from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import Link from "next/link";
import { State } from "../State";

const { Header, Sider } = Layout;

export const AppLayout: FunctionComponent<{ state: State }> = ({
  children,
  state,
}) => {
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
          <Menu theme={"dark"}>
            {state.results.map((result) => (
              <Menu.Item key={result.timestamp}>
                <Link href={`/result/${result.timestamp}`}>
                  <a>
                    {new Date(
                      Number.parseInt(result.timestamp, 10)
                    ).toISOString()}
                  </a>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px", overflowY: "scroll" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
};
