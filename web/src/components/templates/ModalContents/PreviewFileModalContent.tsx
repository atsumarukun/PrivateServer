import { FileProps } from "@/constants/props";
import {
  Box,
  Button,
  HStack,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdImageNotSupported } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useRef } from "react";
import Link from "next/link";

interface Props {
  file: FileProps;
  onClick: (_dIndex: number) => void;
}

export default function PreviewFileModalContent({ file, onClick }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.load();
  }, [file]);

  return (
    <ModalContent mx="5" h="75%">
      <ModalHeader>
        <Link
          href={`${process.env.NEXT_PUBLIC_STORAGE}${router.query.path ?? ""}/${
            file.Name
          }`}
          target="_blank"
        >
          {file.Name}
        </Link>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody h="90%" py="8">
        <HStack h="100%" spacing="0">
          <Button
            variant="ghost"
            h="100%"
            borderRadius="0"
            opacity="0"
            _hover={{
              color: "rgb(255, 255, 255)",
              bg: "rgba(0, 0, 0, 0.5)",
              opacity: 1,
            }}
            onClick={() => onClick(-1)}
          >
            <IoIosArrowBack size="24" />
          </Button>
          {file.MimeType.includes("image") && (
            <Box h="100%" w="100%">
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE}${
                  router.query.path ?? ""
                }/${file.Name}`}
                alt={file.Name}
                h="100%"
                w="100%"
                objectFit="contain"
              />
            </Box>
          )}
          {(file.MimeType.includes("video") ||
            file.MimeType.includes("audio")) && (
            <Box h="100%" w="100%">
              <video
                ref={videoRef}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                controls
                autoPlay
              >
                <source
                  src={`${process.env.NEXT_PUBLIC_STORAGE}${
                    router.query.path ?? ""
                  }/${file.Name}`}
                  type={file.MimeType}
                />
              </video>
            </Box>
          )}
          {!file.MimeType.includes("image") &&
            !file.MimeType.includes("video") &&
            !file.MimeType.includes("audio") && (
              <Box h="100%" w="100%" position="relative">
                <MdImageNotSupported
                  size="64"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%)",
                  }}
                />
              </Box>
            )}
          <Button
            variant="ghost"
            h="100%"
            borderRadius="0"
            opacity="0"
            m="0"
            _hover={{
              color: "rgb(255, 255, 255)",
              bg: "rgba(0, 0, 0, 0.5)",
              opacity: 1,
            }}
            onClick={() => onClick(1)}
          >
            <IoIosArrowForward size="24" />
          </Button>
        </HStack>
      </ModalBody>
    </ModalContent>
  );
}
