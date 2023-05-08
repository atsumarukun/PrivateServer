import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

interface Props {
  fileName: string;
}

const Status = {
  default: 0,
  rename: 1,
  remove: 2,
};

export default function FileMenuModal({ fileName }: Props) {
  const [status, setStatus] = useState(Status.default);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const handleClose = () => {
    {
      setStatus(Status.default);
      onClose();
    }
  };

  const handleRemove = async () => {
    const res = await fetch(
      `/api/storage/remove?key=${router.query.path ?? ""}/${fileName}`
    );
    if (res.status === 200) {
      toast({
        title: "削除しました.",
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
    handleClose();
    router.reload();
  };

  return (
    <>
      <Box position="relative">
        <Button
          variant="ghost"
          position="absolute"
          top="0"
          right="0"
          zIndex="5"
          _hover={{ bg: "rgba(0, 0, 0, 0)" }}
          onClick={onOpen}
        >
          <BsThreeDotsVertical size="20" />
        </Button>
      </Box>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{fileName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {status === Status.default && (
              <VStack alignItems="start" w="40%" mx="auto">
                <Button variant="ghost">
                  <MdDriveFileRenameOutline size="25" />
                  <Text fontWeight="400" ml="2">
                    名前変更
                  </Text>
                </Button>
                <Button variant="ghost">
                  <AiOutlineDownload size="25" />
                  <Text fontWeight="400" ml="2">
                    ダウンロード
                  </Text>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStatus(Status.remove)}
                >
                  <FaRegTrashAlt size="20" />
                  <Text fontWeight="400" ml="2">
                    削除
                  </Text>
                </Button>
              </VStack>
            )}
            {status === Status.remove && (
              <Text>
                削除しますか?
                <br />
                削除後に復元することはできません.
              </Text>
            )}
          </ModalBody>
          {status !== Status.default && (
            <ModalFooter>
              {status === Status.remove && (
                <Box>
                  <Button variant="ghost" onClick={handleClose}>
                    <Text fontWeight="400">キャンセル</Text>
                  </Button>
                  <Button variant="ghost" ml={3} onClick={handleRemove}>
                    <Text fontWeight="400">実行</Text>
                  </Button>
                </Box>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
