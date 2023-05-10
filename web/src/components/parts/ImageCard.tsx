import { AspectRatio, Box, GridItem, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import FileMenuModal from "../templates/FileMenuModal";

interface Props {
  fileName: string;
  href: string;
}

export default function ImageCard({ fileName, href }: Props) {
  const router = useRouter();
  return (
    <Box>
      <FileMenuModal fileName={fileName} />
      <AspectRatio ratio={1 / 1} bgImage={href} bgSize="cover">
        <GridItem bgColor="rgba(255,255,255,0.75)">
          <Image
            src={`${process.env.NEXT_PUBLIC_STORAGE}/${
              router.query.path ?? ""
            }/${fileName}`}
            alt={fileName}
            h="100%"
            w="100%"
            objectFit="contain"
          />
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
    </Box>
  );
}
