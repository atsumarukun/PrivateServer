import { FileMenuStatus } from "@/constants/status";
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
import { Dispatch, SetStateAction } from "react";
import { AiOutlineCopy, AiOutlineDownload } from "react-icons/ai";
import { CgTrashEmpty } from "react-icons/cg";
import {
  MdDriveFileRenameOutline,
  MdOutlineDriveFileMove,
} from "react-icons/md";

interface Props {
  fileName: string;
  onClose: () => void;
  setStatus: Dispatch<SetStateAction<number>>;
}

export default function FileMenuModalContent({
  fileName,
  onClose,
  setStatus,
}: Props) {
  const router = useRouter();
  const toast = useToast();

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
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>{fileName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack alignItems="start" w="40%" mx="auto">
          <Button
            variant="ghost"
            onClick={() => setStatus(FileMenuStatus.rename)}
          >
            <MdDriveFileRenameOutline size="25" />
            <Text fontWeight="400" ml="2">
              名前変更
            </Text>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setStatus(FileMenuStatus.move)}
          >
            <MdOutlineDriveFileMove size="25" />
            <Text fontWeight="400" ml="2">
              移動
            </Text>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setStatus(FileMenuStatus.copy)}
          >
            <AiOutlineCopy size="25" />
            <Text fontWeight="400" ml="2">
              コピ−
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
            onClick={() => setStatus(FileMenuStatus.remove)}
          >
            <CgTrashEmpty size="25" />
            <Text fontWeight="400" ml="2">
              削除
            </Text>
          </Button>
        </VStack>
      </ModalBody>
    </ModalContent>
  );
}