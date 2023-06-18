import { HStack, Text, useToast } from "@chakra-ui/react";
import Link from "next/link";
import Alert from "../parts/Alert";
import { messages } from "@/constants/message";
import { CiPower } from "react-icons/ci";
import axios from "axios";

export default function Header() {
  const toast = useToast();
  const alertMessage = messages.alert.shutdown;

  const onClick = async () => {
    const res = await axios.get("/api/power/shutdown");
    if (res.status === 200) {
      toast({
        title: "シャットダウンしました.",
        status: "success",
        duration: 200,
        isClosable: true,
      });
    } else {
      toast({
        title: "エラーが発生しました.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <header>
      <HStack
        py="5"
        justifyContent="space-between"
        position="fixed"
        left="10%"
        right="10%"
        zIndex="1"
      >
        <Link href="/">
          <Text fontSize="20" fontWeight="300">
            PrivateServer
          </Text>
        </Link>
        <Alert
          onClick={onClick}
          ModalButton={<CiPower size="30" />}
          message={alertMessage}
        />
      </HStack>
    </header>
  );
}
