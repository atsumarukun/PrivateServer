import { FileSelectStatus } from "@/constants/status";
import { StorageContext } from "@/providers/storageProvider";
import {
  Box,
  Button,
  Circle,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import {
  AiOutlineCopy,
  AiOutlineDownload,
  AiOutlineUpload,
} from "react-icons/ai";
import { CgTrashEmpty } from "react-icons/cg";
import { MdOutlineDriveFileMove } from "react-icons/md";

interface Props {
  selectedFiles: string[];
  onClose: () => void;
  paste: () => void;
}

export default function FileListMenuModalContent({
  selectedFiles,
  onClose,
  paste,
}: Props) {
  const context = useContext(StorageContext);
  const router = useRouter();
  const toast = useToast();

  const onClick = (status: number) => {
    context.setStatus(status);
    context.setGlobalFiles(selectedFiles);
    context.setFilePath(
      typeof router.query.path === "string" ? router.query.path : "/"
    );
    onClose();
  };

  const download = async () => {
    try {
      for (var fileName of selectedFiles) {
        const res = await axios.get(
          `/api/storage/download?key=${router.query.path ?? ""}/${fileName}`,
          { responseType: "arraybuffer" }
        );
        if (res.status === 200) {
          const blob = new Blob([res.data]);
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          link.remove();
          toast({
            title: "保存しました.",
            status: "success",
            duration: 200,
            isClosable: true,
          });
        }
      }
    } catch {
      toast({
        title: "エラーが発生しました.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const remove = async () => {
    const query = `keys[]=${router.query.path ?? ""}/${selectedFiles.join(
      `&keys[]=${router.query.path ?? ""}/`
    )}`;
    const res = await axios.delete(`/api/storage/remove?${query}`);
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
    router.reload();
  };

  const handlePaste = () => {
    paste();
    onClose();
  };

  const onDrop = useCallback(async (files: File[]) => {
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
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <ModalContent mx="5">
      <ModalHeader>
        {selectedFiles.length || context.globalFiles.length
          ? "メニュー"
          : "ファイルのアップロード"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {selectedFiles.length || context.globalFiles.length ? (
          <VStack alignItems="start" w="40%" mx="auto">
            {context.status !== FileSelectStatus.move && (
              <Button
                variant="ghost"
                onClick={() => onClick(FileSelectStatus.move)}
              >
                <MdOutlineDriveFileMove size="25" />
                <Text fontWeight="400" ml="2">
                  移動
                </Text>
              </Button>
            )}
            {context.status !== FileSelectStatus.copy && (
              <Button
                variant="ghost"
                onClick={() => onClick(FileSelectStatus.copy)}
              >
                <AiOutlineCopy size="25" />
                <Text fontWeight="400" ml="2">
                  コピ−
                </Text>
              </Button>
            )}
            {context.status !== FileSelectStatus.default && (
              <Button variant="ghost" onClick={handlePaste}>
                <MdOutlineDriveFileMove size="25" />
                <Text fontWeight="400" ml="2">
                  貼りけ
                </Text>
              </Button>
            )}
            <Button variant="ghost" onClick={download}>
              <AiOutlineDownload size="25" />
              <Text fontWeight="400" ml="2">
                ダウンロード
              </Text>
            </Button>
            <Button variant="ghost" onClick={remove}>
              <CgTrashEmpty size="25" />
              <Text fontWeight="400" ml="2">
                削除
              </Text>
            </Button>
          </VStack>
        ) : (
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
        )}
      </ModalBody>
    </ModalContent>
  );
}
