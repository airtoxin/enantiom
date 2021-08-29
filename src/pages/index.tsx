import { VoidFunctionComponent } from "react";
import { GetStaticProps } from "next";

const HomePage: VoidFunctionComponent = () => {
  return <div>Welcome to Next.js!</div>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default HomePage;
