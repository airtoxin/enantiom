import { VoidFunctionComponent } from "react";
import { useRouter } from "next/router";

export const ResultPage: VoidFunctionComponent = () => {
  const router = useRouter();
  const { dirname } = router.query;
  return (
    <div>
      <h1>result {dirname}</h1>
    </div>
  );
};

export default ResultPage;
