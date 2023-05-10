import {
  RenameFileFormSchema,
  renameFileFormSchema,
} from "@/schema/RenameFileFormSchema";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenameFileFormSchema>({
    resolver: zodResolver(renameFileFormSchema),
  });
  const finalRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const handleClose = () => {
    {
      setStatus(Status.default);
      onClose();
    }
  };

  const onSubmit = async (data: RenameFileFormSchema) => {
    if (fileName.includes(".")) {
      data.key += fileName.substring(fileName.lastIndexOf("."));
    }
    data.key = `${router.query.path ?? ""}/${data.key}`;

    const res = await fetch(
      `/api/storage/rename?key=${router.query.path ?? ""}/${fileName}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    if (res.status === 200) {
      toast({
        title: "名前を変更しました.",
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

  const download = async () => {
    const res = await fetch(
      `/api/storage/download?key=${router.query.path ?? ""}/${fileName}`
    );
    if (res.status === 200) {
      try {
        const blob = new Blob([await res.arrayBuffer()]);
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
      } catch {
        toast({
          title: "エラーが発生しました.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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

  const handleRemove = async () => {
    const res = await fetch(
      `/api/storage/remove?key=${router.query.path ?? ""}/${fileName}`,
      {
        method: "DELETE",
      }
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
                <Button
                  variant="ghost"
                  onClick={() => setStatus(Status.rename)}
                >
                  <MdDriveFileRenameOutline size="25" />
                  <Text fontWeight="400" ml="2">
                    名前変更
                  </Text>
                </Button>
                <Button variant="ghost" onClick={download}>
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
            {status === Status.rename && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <FormLabel>ファイル名</FormLabel>
                  {errors.key && <Text color="red">{errors.key.message}</Text>}
                  <Input
                    {...register("key")}
                    defaultValue={
                      fileName.includes(".")
                        ? fileName.substring(0, fileName.lastIndexOf("."))
                        : fileName
                    }
                  />
                </FormControl>
                <Flex justify="right">
                  <Button variant="ghost" type="submit" py="4" mt="3">
                    <Text fontWeight="400">送信</Text>
                  </Button>
                </Flex>
              </form>
            )}
            {status === Status.remove && (
              <>
                <Text>
                  削除しますか?
                  <br />
                  削除後に復元することはできません.
                </Text>
                <Box textAlign="right" pt="4" pb="2">
                  <Button variant="ghost" onClick={handleClose}>
                    <Text fontWeight="400">キャンセル</Text>
                  </Button>
                  <Button variant="ghost" ml={3} onClick={handleRemove}>
                    <Text fontWeight="400">実行</Text>
                  </Button>
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
