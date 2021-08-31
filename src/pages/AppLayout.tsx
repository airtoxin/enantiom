import { FunctionComponent } from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import Link from "next/link";
import { MetaFile } from "../types";

const { Header, Sider } = Layout;

export const AppLayout: FunctionComponent<{ metaFile: MetaFile }> = ({
  children,
}) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Sider width={250} style={{ overflowY: "scroll" }}>
          <Menu>
            <Menu.Item key="2021-08-30-23-27-18-974">
              <Link href={"/result/2021-08-30-23-27-18-974"}>
                <a>2021-08-30-23-27-18-974</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="2021-08-30-23-32-50-833">
              2021-08-30-23-32-50-833
            </Menu.Item>
            <Menu.Item key="1">option3</Menu.Item>
            <Menu.Item key="2">option4</Menu.Item>
            <Menu.Item key="3">option1</Menu.Item>
            <Menu.Item key="4">option2</Menu.Item>
            <Menu.Item key="5">option3</Menu.Item>
            <Menu.Item key="6">option4</Menu.Item>
            <Menu.Item key="7">option1</Menu.Item>
            <Menu.Item key="8">option2</Menu.Item>
            <Menu.Item key="9">option3</Menu.Item>
            <Menu.Item key="10">option4</Menu.Item>
            <Menu.Item key="11">option1</Menu.Item>
            <Menu.Item key="12">option2</Menu.Item>
            <Menu.Item key="13">option3</Menu.Item>
            <Menu.Item key="14">option4</Menu.Item>
            <Menu.Item key="15">option1</Menu.Item>
            <Menu.Item key="16">option2</Menu.Item>
            <Menu.Item key="17">option3</Menu.Item>
            <Menu.Item key="18">option4</Menu.Item>
            <Menu.Item key="19">option1</Menu.Item>
            <Menu.Item key="20">option2</Menu.Item>
            <Menu.Item key="21">option3</Menu.Item>
            <Menu.Item key="22">option4</Menu.Item>
            <Menu.Item key="23">option1</Menu.Item>
            <Menu.Item key="24">option2</Menu.Item>
            <Menu.Item key="25">option3</Menu.Item>
            <Menu.Item key="26">option4</Menu.Item>
            <Menu.Item key="27">option1</Menu.Item>
            <Menu.Item key="28">option2</Menu.Item>
            <Menu.Item key="29">option3</Menu.Item>
            <Menu.Item key="30">option4</Menu.Item>
            <Menu.Item key="31">option1</Menu.Item>
            <Menu.Item key="32">option2</Menu.Item>
            <Menu.Item key="33">option3</Menu.Item>
            <Menu.Item key="34">option4</Menu.Item>
            <Menu.Item key="35">option1</Menu.Item>
            <Menu.Item key="36">option2</Menu.Item>
            <Menu.Item key="37">option3</Menu.Item>
            <Menu.Item key="38">option4</Menu.Item>
            <Menu.Item key="39">option1</Menu.Item>
            <Menu.Item key="40">option2</Menu.Item>
            <Menu.Item key="41">option3</Menu.Item>
            <Menu.Item key="42">option4</Menu.Item>
            <Menu.Item key="43">option1</Menu.Item>
            <Menu.Item key="44">option2</Menu.Item>
            <Menu.Item key="45">option3</Menu.Item>
            <Menu.Item key="46">option4</Menu.Item>
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
