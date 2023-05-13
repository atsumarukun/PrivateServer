import { FileSelectStatus } from "@/constants/status";
import { StorageContext } from "@/providers/storageProvider";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { MdOutlineDriveFileMove } from "react-icons/md";

interface Props {
  onClick: () => void;
  onClose: () => void;
}

export default function PasteFileMenuModalContent({ onClick, onClose }: Props) {
  const handleClick = () => {
    onClick();
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>FileMenu</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack alignItems="start" w="40%" mx="auto">
          <Button variant="ghost" onClick={handleClick}>
            <MdOutlineDriveFileMove size="25" />
            <Text fontWeight="400" ml="2">
              貼りけ
            </Text>
          </Button>
        </VStack>
      </ModalBody>
    </ModalContent>
  );
}
