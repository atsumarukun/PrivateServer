import { AspectRatio, Box, GridItem, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface Props {
  text?: string;
  alt: string;
  src: string;
}

export default function ImageCard({ text, alt, src }: Props) {
  const router = useRouter();
  return (
    <AspectRatio ratio={1 / 1} bgImage={src} bgSize="cover">
      <GridItem bgColor="rgba(255,255,255,0.75)">
        <Image src={src} alt={alt} h="100%" w="100%" objectFit="contain" />
        {text && (
          <Text
            position="absolute"
            color="white"
            bgColor="blackAlpha.500"
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
