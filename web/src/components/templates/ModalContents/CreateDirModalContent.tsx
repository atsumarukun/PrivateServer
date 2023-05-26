import {
  CreateDirFormSchema,
  createDirFormSchema,
} from "@/schema/CreateDirFormSchema";
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
  onClose: () => void;
}

export default function CreateDirModalContent({ onClose }: Props) {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDirFormSchema>({
    resolver: zodResolver(createDirFormSchema),
  });

  const onSubmit = async (data: CreateDirFormSchema) => {
    data.name = `${data.name}`;

    const res = await axios.post(
      `/api/storage/create?path=${router.query.path ?? ""}`,
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status === 200) {
      toast({
        title: "作成しました.",
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
      <ModalHeader>ディレクトリの作成</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>ディレクトリ名</FormLabel>
            {errors.name && <Text color="red">{errors.name.message}</Text>}
            <Input {...register("name")} />
          </FormControl>
          <Flex justify="right">
            <Button variant="ghost" type="submit" py="4" mt="3">
              <Text fontWeight="400">作成</Text>
            </Button>
          </Flex>
        </form>
      </ModalBody>
    </ModalContent>
  );
}
