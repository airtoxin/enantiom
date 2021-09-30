import { FunctionComponent } from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { State } from "../State";
import { formatTimestamp } from "../utils";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";
import Head from "next/head";
import urljoin from "url-join";
import { basePath } from "./constants";

const { Header, Sider, Content } = Layout;

export const AppLayout: FunctionComponent<{
  state: State;
  timestamp?: string;
}> = ({ children, state, timestamp }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Head>
        <title key="title">enantiom</title>
        <meta property="og:title" content="enantiom" key="og:title" />
        <link
          key="favicon"
          rel="icon"
          href={urljoin(basePath, "/images/enantiom_object.svg")}
          type="image/svg+xml"
        />
      </Head>

      <Header
        style={{
          padding: 0,
        }}
      >
        <Link href="/">
          <a>
            <img
              src={urljoin(basePath, "/images/enantiom_logo_white.svg")}
              alt="enantiom logo"
              width={260}
              height={64}
              style={{ padding: 4 }}
            />
          </a>
        </Link>
      </Header>

      <Layout>
        <Sider theme={"dark"} width={260} style={{ overflowY: "scroll" }}>
          <Menu theme={"dark"} selectedKeys={timestamp ? [timestamp] : []}>
            {state.results.map((result, i) => (
              <Menu.Item
                key={result.timestamp}
                icon={
                  result.screenshots.some((s) => !s.ok) ? (
                    <ExclamationCircleTwoTone twoToneColor="#f5222d" />
                  ) : (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  )
                }
                style={i === 0 ? { marginTop: 0 } : {}}
              >
                <Link href={`/result/${result.timestamp}.html`}>
                  {formatTimestamp(result.timestamp)}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ padding: 24, overflowY: "scroll" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
