import {
  ShowHideFileFormSchema,
  showHideFileFormSchema,
} from "@/schema/ShowHideFileFormSchema";
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
import { useForm } from "react-hook-form";
import { setCookie } from "nookies";
import { useRouter } from "next/router";

export default function ShowHideFileModalContent() {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShowHideFileFormSchema>({
    resolver: zodResolver(showHideFileFormSchema),
  });

  const onSubmit = async (data: ShowHideFileFormSchema) => {
    try {
      const res = await axios.post(
        "/api/auth/verification",
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setCookie(null, "token", res.data.token, {
        maxAge: 60 * 60,
        path: "/",
      });
      toast({
        title: "ログインしました.",
        status: "success",
        duration: 200,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "エラーが発生しました.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    router.reload();
  };

  return (
    <ModalContent mx="5">
      <ModalHeader>隠しファイルの表示</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>パスワード</FormLabel>
            {errors.password && (
              <Text color="red">{errors.password.message}</Text>
            )}
            <Input {...register("password")} type="password" />
          </FormControl>
          <Flex justify="right">
            <Button variant="ghost" type="submit" py="4" mt="3">
              <Text fontWeight="400">表示</Text>
            </Button>
          </Flex>
        </form>
      </ModalBody>
    </ModalContent>
  );
}
