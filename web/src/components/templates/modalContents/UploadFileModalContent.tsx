import {
  Box,
  Button,
  Circle,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineUpload } from "react-icons/ai";

export default function UploadFileModalContent() {
  const router = useRouter();
  const toast = useToast();

  const onDrop = useCallback(
    async (files: File[]) => {
      const formData = new FormData();
      formData.append("file", files[0]);
      const res = await axios.post(
        `/api/storage/upload?path=${router.query.path ?? "/"}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status === 200) {
        toast({
          title: "アップロードしました.",
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
      router.reload();
    },
    [router, toast]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <ModalContent mx="5">
      <ModalHeader>ファイルのアップロード</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box
          {...getRootProps()}
          h="50vh"
          textAlign="center"
          position="relative"
        >
          <Box
            position="absolute"
            w="100%"
            top="50%"
            transform="translateY(-50%)"
          >
            <Circle size="24" bgColor="gray.100" mx="auto">
              <AiOutlineUpload size="28" />
            </Circle>
            <Text fontSize="12" mt="5">
              アップロードするファイルをドラッグ＆ドロップします
            </Text>
            <Button colorScheme="blue" borderRadius="3" h="8" mt="5">
              <Text fontSize="12">ファイルを選択</Text>
            </Button>
          </Box>
          <input {...getInputProps()} />
        </Box>
      </ModalBody>
    </ModalContent>
  );
}
