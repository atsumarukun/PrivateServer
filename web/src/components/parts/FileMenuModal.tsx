import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

interface Props {
  fileName: string;
}

export default function FileMenuModal({ fileName }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

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
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{fileName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
              <Button variant="ghost">
                <FaRegTrashAlt size="20" />
                <Text fontWeight="400" ml="2">
                  削除
                </Text>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
