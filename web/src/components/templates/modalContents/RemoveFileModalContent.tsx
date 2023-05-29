import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

interface Props {
  fileName: string;
  onClose: () => void;
}

export default function RemoveFileModalContent({ fileName, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();

  const handleRemove = async () => {
    const res = await axios.delete(
      `/api/storage/remove?keys[]=${router.query.path ?? ""}/${fileName}`
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
    onClose();
    router.reload();
  };

  return (
    <ModalContent mx="5">
      <ModalHeader>{fileName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>
          削除しますか?
          <br />
          削除後に復元することはできません.
        </Text>
        <Box textAlign="right" pt="4" pb="2">
          <Button variant="ghost" onClick={onClose}>
            <Text fontWeight="400">キャンセル</Text>
          </Button>
          <Button variant="ghost" ml={3} onClick={handleRemove}>
            <Text fontWeight="400">実行</Text>
          </Button>
        </Box>
      </ModalBody>
    </ModalContent>
  );
}
