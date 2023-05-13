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
  selectedFiles: string[];
  onClose: () => void;
}

export default function FileListMenuModalContent({
  selectedFiles,
  onClose,
}: Props) {
  const context = useContext(StorageContext);
  const router = useRouter();

  const onClick = (status: number) => {
    context.setStatus(status);
    context.setGlobalFiles(selectedFiles);
    context.setFilePath(
      typeof router.query.path === "string" ? router.query.path : "/"
    );
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>FileMenu</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {selectedFiles.length ? (
          <VStack alignItems="start" w="40%" mx="auto">
            <Button
              variant="ghost"
              onClick={() => onClick(FileSelectStatus.move)}
            >
              <MdOutlineDriveFileMove size="25" />
              <Text fontWeight="400" ml="2">
                移動
              </Text>
            </Button>
            <Button
              variant="ghost"
              onClick={() => onClick(FileSelectStatus.copy)}
            >
              <AiOutlineCopy size="25" />
              <Text fontWeight="400" ml="2">
                コピ−
              </Text>
            </Button>
          </VStack>
        ) : (
          <>
            <Text>ファイルを選択してください.</Text>
            <Button variant="ghost" float="right" onClick={onClose}>
              <Text fontWeight="400">閉じる</Text>
            </Button>
          </>
        )}
      </ModalBody>
    </ModalContent>
  );
}
