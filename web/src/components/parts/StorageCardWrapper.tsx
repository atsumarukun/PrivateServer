import { Box } from "@chakra-ui/react";
import { KeyboardEventHandler, MouseEventHandler, ReactNode } from "react";
import FileMenuModal from "../templates/FileMenuModal";

interface Props {
  children: ReactNode;
  border: string;
  tabIndex: number;
  fileName: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

export default function StorageCardWrapper({
  children,
  border,
  tabIndex,
  fileName,
  onClick,
  onKeyDown,
}: Props) {
  return (
    <Box>
      <FileMenuModal fileName={fileName} />
      <Box
        border={border}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {children}
      </Box>
    </Box>
  );
}
