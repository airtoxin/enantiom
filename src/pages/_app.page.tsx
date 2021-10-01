import "antd/dist/antd.css";
import "react-image-lightbox/style.css";
import { AppProps } from "next/app";
import { ResultFilterProvider } from "./ResultFilterContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ResultFilterProvider>
      <Component {...pageProps} />
    </ResultFilterProvider>
  );
};

export default MyApp;
