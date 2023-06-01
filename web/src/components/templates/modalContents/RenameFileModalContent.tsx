import { FileProps } from "@/constants/props";
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
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface Props {
  file: FileProps;
  onClose: () => void;
}

export default function RenameFileModalContent({ file, onClose }: Props) {
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
    if (file.MimeType !== "dir") {
      data.key += file.Name.substring(file.Name.lastIndexOf("."));
    }
    data.key = `${router.query.path ?? ""}/${data.key}`;

    const res = await axios.put(
      `/api/storage/rename?key=${router.query.path ?? ""}/${file.Name}`,
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
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
    <ModalContent mx="5">
      <ModalHeader>{file.Name}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>ファイル名</FormLabel>
            {errors.key && <Text color="red">{errors.key.message}</Text>}
            <Input
              {...register("key")}
              defaultValue={
                file.MimeType === "dir"
                  ? file.Name
                  : file.Name.substring(0, file.Name.lastIndexOf("."))
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
