import { AspectRatio, GridItem, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  fileName: string;
  href: string;
}

export default function FileCard({ Icon, fileName, href }: Props) {
  const router = useRouter();

  return (
    <Link href={href}>
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
    </Link>
  );
}
