import { AspectRatio, GridItem, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  text?: string;
  color?: string;
}

export default function IconCard({ Icon, text, color }: Props) {
  return (
    <AspectRatio ratio={1 / 1}>
      <GridItem bgColor="gray.100">
        <Icon size="25%" />
        {text && (
          <Text
            position="absolute"
            color="white"
            bgColor={color ?? "blackAlpha.500"}
            bottom="0"
            w="100%"
            textAlign="center"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            px="2"
          >
            {text}
          </Text>
        )}
      </GridItem>
    </AspectRatio>
  );
}
