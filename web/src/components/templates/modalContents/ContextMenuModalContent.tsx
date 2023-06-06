import { ContextMenuStatus } from "@/constants/status";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { BiHide } from "react-icons/bi";

interface Props {
  onClick: Dispatch<SetStateAction<number>>;
}

export default function ContextMenuModalContent({ onClick }: Props) {
  return (
    <ModalContent mx="5">
      <ModalHeader>メニュー</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack alignItems="start" w="60%" mx="auto">
          <Button
            variant="ghost"
            onClick={() => onClick(ContextMenuStatus.create)}
          >
            <MdOutlineCreateNewFolder size="25" />
            <Text fontWeight="400" ml="2">
              ディレクトリの作成
            </Text>
          </Button>
          <Button
            variant="ghost"
            onClick={() => onClick(ContextMenuStatus.upload)}
          >
            <AiOutlineUpload size="25" />
            <Text fontWeight="400" ml="2">
              ファイルのアップロード
            </Text>
          </Button>
          <Button
            variant="ghost"
            onClick={() => onClick(ContextMenuStatus.show)}
          >
            <BiHide size="25" />
            <Text fontWeight="400" ml="2">
              隠しファイルの表示
            </Text>
          </Button>
        </VStack>
      </ModalBody>
    </ModalContent>
  );
}
