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
import { useRef } from "react";
import { IconType } from "react-icons";

interface Props {
  onClick: () => void;
  Icon: IconType;
  message: {
    title: string;
    body: string;
  };
  size?: string;
}

export default function Alert({ onClick, Icon, message, size }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleClick = () => {
    onClick();
    onClose();
  };

  return (
    <>
      <button onClick={onOpen}>
        <Icon size={size} />
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
          <AlertDialogHeader>{message.title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody whiteSpace="pre-wrap">
            {message.body}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="ghost" ref={cancelRef} onClick={onClose}>
              <Text fontWeight="400">いいえ</Text>
            </Button>
            <Button variant="ghost" ml={3} onClick={handleClick}>
              <Text fontWeight="400">はい</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
