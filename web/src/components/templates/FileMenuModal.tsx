import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import RenameFileModalContent from "./ModalContents/RenameFileModalContent";
import FileMenuModalContent from "./ModalContents/FileMenuModalContent";
import RemoveFileModalContent from "./ModalContents/RemoveFileModalContent";
import MoveFileModalContent from "./ModalContents/MoveFileModalContent";
import CopyFileModalContent from "./ModalContents/CopyFileModalContent";
import { FileMenuStatus } from "@/constants/status";

interface Props {
  fileName: string;
}

export default function FileMenuModal({ fileName }: Props) {
  const [status, setStatus] = useState(FileMenuStatus.default);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  const handleClose = () => {
    {
      setStatus(FileMenuStatus.default);
      onClose();
    }
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
        {status === FileMenuStatus.default && (
          <FileMenuModalContent
            fileName={fileName}
            onClose={handleClose}
            setStatus={setStatus}
          />
        )}
        {status === FileMenuStatus.rename && (
          <RenameFileModalContent fileName={fileName} onClose={handleClose} />
        )}
        {status === FileMenuStatus.move && (
          <MoveFileModalContent fileName={fileName} onClose={handleClose} />
        )}
        {status === FileMenuStatus.copy && (
          <CopyFileModalContent fileName={fileName} onClose={handleClose} />
        )}
        {status === FileMenuStatus.remove && (
          <RemoveFileModalContent fileName={fileName} onClose={handleClose} />
        )}
      </Modal>
    </>
  );
}
