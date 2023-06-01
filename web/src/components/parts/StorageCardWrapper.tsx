import { Box } from "@chakra-ui/react";
import { KeyboardEventHandler, MouseEventHandler, ReactNode } from "react";
import FileMenuModal from "../templates/FileMenuModal";
import { FileProps } from "@/constants/props";

interface Props {
  children: ReactNode;
  border: string;
  tabIndex: number;
  file: FileProps;
  onClick: MouseEventHandler<HTMLDivElement>;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

export default function StorageCardWrapper({
  children,
  border,
  tabIndex,
  file,
  onClick,
  onKeyDown,
}: Props) {
  return (
    <Box>
      <FileMenuModal file={file} />
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
