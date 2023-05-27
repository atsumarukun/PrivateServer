import { FileSelectStatus } from "@/constants/status";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface Props {
  children: ReactNode;
}

interface StorageContextProps {
  globalFiles: string[];
  setGlobalFiles: Dispatch<SetStateAction<string[]>>;
  filePath: string;
  setFilePath: Dispatch<SetStateAction<string>>;
  status: number;
  setStatus: Dispatch<SetStateAction<number>>;
}

export const StorageContext = createContext<StorageContextProps>({
  globalFiles: [],
  setGlobalFiles: () => [],
  filePath: "",
  setFilePath: () => "",
  status: FileSelectStatus.default,
  setStatus: () => FileSelectStatus.default,
});

export default function StorageProvider({ children }: Props) {
  const [globalFiles, setGlobalFiles] = useState<string[]>([]);
  const [filePath, setFilePath] = useState<string>("");
  const [status, setStatus] = useState(FileSelectStatus.default);

  return (
    <StorageContext.Provider
      value={{
        globalFiles,
        setGlobalFiles,
        filePath,
        setFilePath,
        status,
        setStatus,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}
