import IconCard from "@/components/parts/IconCard";
import {
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { IconType } from "react-icons";
import { IoIosApps } from "react-icons/io";
import { SiMinecraft } from "react-icons/si";
import { FaServer, FaYoutube } from "react-icons/fa";
import Alert from "@/components/parts/Alert";
import { messages } from "@/constants/message";
import { useRouter } from "next/router";
import { useRef } from "react";

interface Props {
  services: {
    Name: string;
    Status: string;
    ConfigFiles: string;
  }[];
}

export default function Service({ services }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  const onClick = async (status: string, path: string) => {
    let res;
    onOpen();
    if (status.includes("running")) {
      res = await axios.put(`/api/service/stop?path=${path}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      res = await axios.put(`/api/service/start?path=${path}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    onClose();
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
  };

  return (
    <main>
      <Grid
        gap="8"
        py="10"
        mb="10"
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
      >
        {services.map((v) => {
          let Icon: IconType;
          if (v.Name === "minecraft") {
            Icon = SiMinecraft;
          } else if (v.Name.includes("server")) {
            Icon = FaServer;
          } else if (v.Name.includes("youtube")) {
            Icon = FaYoutube;
          } else {
            Icon = IoIosApps;
          }
          return (
            <Alert
              ModalButton={
                <GridItem>
                  <IconCard
                    Icon={Icon}
                    text={v.Name}
                    color={
                      v.Status.includes("running") ? "green.500" : "red.500"
                    }
                  />
                </GridItem>
              }
              message={
                v.Status.includes("running")
                  ? messages.alert.stopService
                  : messages.alert.startService
              }
              onClick={() => onClick(v.Status, v.ConfigFiles)}
              key={v.Name}
            />
          );
        })}
      </Grid>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent minH="15%">
          <ModalBody display="flex" justifyContent="center" alignItems="center">
            <VStack spacing="3">
              <Text>実行中です.</Text>
              <Spinner />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/service`
  );
  return { props: res.data };
}
