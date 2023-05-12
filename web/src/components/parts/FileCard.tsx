import { AspectRatio, Box, GridItem, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  fileName: string;
}

export default function FileCard({ Icon, fileName }: Props) {
  return (
    <AspectRatio ratio={1 / 1}>
      <GridItem bgColor="gray.100">
        <Icon size="25%" />
        <Text
          position="absolute"
          color="white"
          bgColor="blackAlpha.500"
          bottom="0"
          w="100%"
          textAlign="center"
          whiteSpace="nowrap"
        >
          {fileName}
        </Text>
      </GridItem>
    </AspectRatio>
  );
}
