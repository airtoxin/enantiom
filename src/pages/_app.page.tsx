import "antd/dist/antd.css";
import { AppComponent } from "next/dist/shared/lib/router/router";

const MyApp: AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
