import {
  RenameFileFormSchema,
  renameFileFormSchema,
} from "@/schema/RenameFileFormSchema";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface Props {
  fileName: string;
  onClose: () => void;
}

export default function RenameFileModalContent({ fileName, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenameFileFormSchema>({
    resolver: zodResolver(renameFileFormSchema),
  });

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
    onClose();
    router.reload();
  };

  return (
    <ModalContent>
      <ModalHeader>{fileName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
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
      </ModalBody>
    </ModalContent>
  );
}
