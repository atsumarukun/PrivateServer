import { Box } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

interface Props {
  children: ReactNode;
  border: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function StorageCardWrapper({
  children,
  onClick,
  border,
}: Props) {
  return (
    <Box border={border} onClick={onClick}>
      {children}
    </Box>
  );
}
