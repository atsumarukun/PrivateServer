import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRef } from "react";
import { CiPower } from "react-icons/ci";

function PowerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const toast = useToast();

  const onClick = async () => {
    const res = await fetch("/api/power/shutdown");
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
    onClose();
  };

  return (
    <>
      <button onClick={onOpen}>
        <CiPower size="30" />
      </button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>シャットダウン</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            シャットダウンしますか?
            <br />
            実行中のプロセスが中断され、データが保存されない恐れがあります.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              いいえ
            </Button>
            <Button colorScheme="red" ml={3} onClick={onClick}>
              はい
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function Header() {
  return (
    <header>
      <HStack py="5" justifyContent="space-between" position="fixed" w="80%">
        <Link href="/">
          <Text fontSize="20" fontWeight="300">
            PrivateServer
          </Text>
        </Link>
        <PowerButton />
      </HStack>
    </header>
  );
}
