import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useRef } from "react";

interface Props {
  onClick: () => void;
  ModalButton: ReactNode;
  message: {
    title: string;
    body: string;
  };
}

export default function Alert({ onClick, ModalButton, message }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleClick = () => {
    onClick();
    onClose();
  };

  return (
    <>
      <button onClick={onOpen}>{ModalButton}</button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent mx="5">
          <AlertDialogHeader>{message.title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody whiteSpace="pre-wrap">
            {message.body}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="ghost" ref={cancelRef} onClick={onClose}>
              <Text fontWeight="400">キャンセル</Text>
            </Button>
            <Button variant="ghost" ml={3} onClick={handleClick}>
              <Text fontWeight="400">実行</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
