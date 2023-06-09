import { StorageProps } from "@/constants/props";
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
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  fileName: string;
  onClose: () => void;
}

export default function CopyFileModalContent({ fileName, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [path, setPath] = useState<string>(
    typeof router.query.path === "string" ? router.query.path : ""
  );
  const [files, setFiles] = useState<StorageProps>();

  useEffect(() => {
    const axiosFunction = async () => {
      const res = await axios.get(`/api/storage/gets?path=${path}`);
      setFiles(res.data);
    };
    axiosFunction();
  }, [path]);

  const onClick = async () => {
    const res = await axios.put(
      `/api/storage/copy?keys[]=${router.query.path ?? ""}/${fileName}`,
      JSON.stringify({ path: path }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status === 200) {
      toast({
        title: "コピーしました.",
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
    router.push({ query: { path: path } });
  };

  return (
    <ModalContent mx="5">
      <ModalHeader>{fileName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text w="100%" borderBottom="solid 1px black">
          現在の場所: {path ? path : "/"}
        </Text>
        <VStack mt="5">
          {path && (
            <Button
              variant="ghost"
              w="100%"
              h="30"
              borderRadius="0"
              justifyContent="start"
              onClick={() => setPath(path.slice(0, path.lastIndexOf("/")))}
            >
              <Text fontWeight="400">../</Text>
            </Button>
          )}
          {files?.files?.map((f, i) => {
            if (f.MimeType === "dir") {
              return (
                <Button
                  variant="ghost"
                  w="100%"
                  h="30"
                  borderRadius="0"
                  justifyContent="start"
                  key={i}
                  onClick={() => setPath(`${path}/${f.Name}`)}
                >
                  <Text fontWeight="400">{f.Name}</Text>
                </Button>
              );
            }
          })}
        </VStack>
        <Button variant="ghost" float="right" onClick={onClick}>
          <Text fontWeight="400">ここにコピー</Text>
        </Button>
      </ModalBody>
    </ModalContent>
  );
}
