import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type ResultFilter = {
  add: boolean;
  diff: boolean;
  noDiff: boolean;
};
const defaultValue: ResultFilter = {
  add: true,
  diff: true,
  noDiff: true,
};
const ResultFilterContext = createContext<ResultFilter>(defaultValue);
const SetResultFilterContext = createContext<
  Dispatch<SetStateAction<ResultFilter>>
>(() => {});

export const ResultFilterProvider: FunctionComponent = ({ children }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <ResultFilterContext.Provider value={value}>
      <SetResultFilterContext.Provider value={setValue}>
        {children}
      </SetResultFilterContext.Provider>
    </ResultFilterContext.Provider>
  );
};

export const useResultFilter = () => useContext(ResultFilterContext);
export const useSetResultFilter = () => {
  const resultFilter = useResultFilter();
  const setValue = useContext(SetResultFilterContext);

  return {
    setAdd: (add: boolean) => setValue({ ...resultFilter, add }),
    setDiff: (diff: boolean) => setValue({ ...resultFilter, diff }),
    setNoDiff: (noDiff: boolean) => setValue({ ...resultFilter, noDiff }),
  };
};
