import { Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { MdStorage } from "react-icons/md";

export default function MenuCard() {
  return (
    <Link href="/storage">
      <VStack>
        <MdStorage size="75" />
        <Text>Storage</Text>
      </VStack>
    </Link>
  );
}
