import { VoidFunctionComponent } from "react";
import { GetStaticProps } from "next";
import { join } from "path";
import { promises as fs } from "fs";
import { MetaFile } from "../../types";
import { AppLayout } from "../AppLayout";
import { Image, Layout, List } from "antd";

const { Content } = Layout;

export const ResultPage: VoidFunctionComponent<{ metaFile: MetaFile }> = ({
  metaFile,
}) => {
  return (
    <AppLayout metaFile={metaFile}>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <List>
          {metaFile.results.map((result) => (
            <List.Item key={result.filepath}>
              <Image
                preview
                src={result.filepath.replace("public", "")}
                width={result.size.width}
                height={result.size.height}
              />
            </List.Item>
          ))}
        </List>
      </Content>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const metaFilePath = join(process.cwd(), "public/meta.json");
  const rawFile = await fs.readFile(metaFilePath, { encoding: "utf-8" });
  const metaFile = MetaFile.parse(JSON.parse(rawFile));

  return {
    props: {
      metaFile,
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const metaFilePath = join(process.cwd(), "public/meta.json");
//   const rawFile = await fs.readFile(metaFilePath, { encoding: "utf-8" });
//   const metaFile = MetaFile.parse(JSON.parse(rawFile));
//
//   return {
//     paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
//     fallback: false,
//   };
// };

export default ResultPage;
