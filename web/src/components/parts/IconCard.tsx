import { AspectRatio, Box, GridItem, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  text?: string;
}

export default function IconCard({ Icon, text }: Props) {
  return (
    <AspectRatio ratio={1 / 1}>
      <GridItem bgColor="gray.100">
        <Icon size="25%" />
        {text && (
          <Text
            position="absolute"
            color="white"
            bgColor="blackAlpha.500"
            bottom="0"
            w="100%"
            textAlign="center"
            whiteSpace="nowrap"
          >
            {text}
          </Text>
        )}
      </GridItem>
    </AspectRatio>
  );
}
