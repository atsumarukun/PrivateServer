import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import RenameFileModalContent from "./modalContents/RenameFileModalContent";
import FileMenuModalContent from "./modalContents/FileMenuModalContent";
import RemoveFileModalContent from "./modalContents/RemoveFileModalContent";
import MoveFileModalContent from "./modalContents/MoveFileModalContent";
import CopyFileModalContent from "./modalContents/CopyFileModalContent";
import { FileMenuStatus } from "@/constants/status";
import { FileProps } from "@/constants/props";

interface Props {
  file: FileProps;
}

export default function FileMenuModal({ file }: Props) {
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
            file={file}
            onClose={handleClose}
            setStatus={setStatus}
          />
        )}
        {status === FileMenuStatus.rename && (
          <RenameFileModalContent file={file} onClose={handleClose} />
        )}
        {status === FileMenuStatus.move && (
          <MoveFileModalContent fileName={file.Name} onClose={handleClose} />
        )}
        {status === FileMenuStatus.copy && (
          <CopyFileModalContent fileName={file.Name} onClose={handleClose} />
        )}
        {status === FileMenuStatus.remove && (
          <RemoveFileModalContent fileName={file.Name} onClose={handleClose} />
        )}
      </Modal>
    </>
  );
}
