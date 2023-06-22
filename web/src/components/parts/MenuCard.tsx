import { HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { IoIosApps } from "react-icons/io";
import { MdStorage } from "react-icons/md";

export default function MenuCard() {
  return (
    <HStack justifyContent="center" gap="5">
      <Link href="/storage">
        <VStack>
          <MdStorage size="75" />
          <Text>Storage</Text>
        </VStack>
      </Link>
      <Link href="/service">
        <VStack>
          <IoIosApps size="75" />
          <Text>Service</Text>
        </VStack>
      </Link>
    </HStack>
  );
}
