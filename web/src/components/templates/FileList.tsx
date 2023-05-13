import IconCard from "@/components/parts/IconCard";
import ImageCard from "@/components/parts/ImageCard";
import { StorageProps } from "@/constants/props";
import {
  Box,
  Grid,
  Modal,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { AiFillFolder, AiFillFile } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { MdMovie } from "react-icons/md";
import StorageCardWrapper from "../parts/StorageCardWrapper";
import { KeyboardEvent, MouseEvent, useContext, useRef, useState } from "react";
import { FileSelectStatus } from "@/constants/status";
import { StorageContext } from "@/providers/storageProvider";
import FileListMenuModalContent from "./ModalContents/FileListMenuModalContent";
import PasteFileMenuModalContent from "./ModalContents/PasteFileModalContent";

export default function FileList({ files }: StorageProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const context = useContext(StorageContext);
  const finalRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const onClick = (
    fileName: string,
    mimeType: string,
    e: MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      // ファイル選択(ctrlを押しながらクリック)
      if (selectedFiles.includes(fileName)) {
        const index = selectedFiles.indexOf(fileName);
        setSelectedFiles([
          ...selectedFiles.slice(0, index),
          ...selectedFiles.slice(index + 1),
        ]);
      } else {
        setSelectedFiles([fileName, ...selectedFiles]);
      }
    } else {
      if (
        context.globalFiles.length &&
        context.status === FileSelectStatus.default
      ) {
        // 選択ファイル変更(通常クリック)
        setSelectedFiles([fileName]);
      } else {
        // ファイル表示(通常クリック)
        if (mimeType === "dir") {
          router.push({ query: `path=${router.query.path ?? ""}/${fileName}` });
        } else {
          document.location.href = `${process.env.NEXT_PUBLIC_STORAGE}${
            router.query.path ?? ""
          }/${fileName}`;
        }
        setSelectedFiles([]);
      }
    }
  };

  const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onOpen();
  };

  const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    const query = `keys[]=${router.query.path ?? ""}/${selectedFiles.join(
      `&keys[]=${router.query.path ?? ""}/`
    )}`;
    if (e.key === "Delete") {
      const res = await fetch(`/api/storage/remove?${query}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        toast({
          title: "削除しました.",
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
    } else if (e.ctrlKey) {
      if (e.key === "c") {
        context.setStatus(FileSelectStatus.copy);
      } else if (e.key === "x") {
        context.setStatus(FileSelectStatus.move);
      } else {
        return;
      }
      context.setGlobalFiles(selectedFiles);
      context.setFilePath(
        typeof router.query.path === "string" ? router.query.path : "/"
      );
    }
  };

  const paste = async () => {
    if (context.status === FileSelectStatus.copy) {
      const query = `keys[]=${context.filePath}/${context.globalFiles.join(
        `&keys[]=${context.filePath}/`
      )}`;
      const res = await fetch(`/api/storage/copy?${query}`, {
        method: "PUT",
        body: JSON.stringify({ path: router.query.path ?? "/" }),
      });
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
    } else if (context.status === FileSelectStatus.move) {
      const query = `keys[]=${context.filePath}/${context.globalFiles.join(
        `&keys[]=${context.filePath}/`
      )}`;
      const res = await fetch(`/api/storage/move?${query}`, {
        method: "PUT",
        body: JSON.stringify({ path: router.query.path ?? "/" }),
      });
      if (res.status === 200) {
        toast({
          title: "移動しました.",
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
    }
    router.reload();
    context.setGlobalFiles([]);
    context.setFilePath(
      typeof router.query.path === "string" ? router.query.path : ""
    );
    context.setStatus(FileSelectStatus.default);
  };

  const keyboardPaste = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (context.globalFiles.length && e.ctrlKey && e.key === "v") {
      await paste();
    }
  };

  return (
    <>
      <Box
        position="absolute"
        h="100vh"
        w="100vw"
        top="0"
        left="0"
        tabIndex={0}
        onClick={() => setSelectedFiles([])}
        onContextMenu={(e) => onContextMenu(e)}
        onKeyDown={(e) => keyboardPaste(e)}
      />
      <Grid
        gap="8"
        py="10"
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
      >
        {files?.map((f, i) => {
          if (f.MimeType.includes("image")) {
            return (
              <StorageCardWrapper
                tabIndex={0}
                fileName={f.Name}
                onKeyDown={(e) => onKeyDown(e)}
                onClick={(e) => onClick(f.Name, f.MimeType, e)}
                border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
                key={i}
              >
                <ImageCard
                  src={`${process.env.NEXT_PUBLIC_STORAGE}${
                    router.query.path ?? ""
                  }/${f.Name}`}
                  alt={f.Name}
                  text={f.Name}
                />
              </StorageCardWrapper>
            );
          } else if (f.MimeType === "dir") {
            return (
              <StorageCardWrapper
                tabIndex={0}
                fileName={f.Name}
                onKeyDown={(e) => onKeyDown(e)}
                onClick={(e) => onClick(f.Name, f.MimeType, e)}
                border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
                key={i}
              >
                <IconCard text={f.Name} Icon={AiFillFolder} />
              </StorageCardWrapper>
            );
          } else {
            var Icon: IconType;
            if (f.MimeType.includes("audio")) {
              Icon = BsMusicNoteBeamed;
            } else if (f.MimeType.includes("video")) {
              Icon = MdMovie;
            } else {
              Icon = AiFillFile;
            }

            return (
              <StorageCardWrapper
                tabIndex={0}
                fileName={f.Name}
                onKeyDown={(e) => onKeyDown(e)}
                onClick={(e) => onClick(f.Name, f.MimeType, e)}
                border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
                key={i}
              >
                <IconCard text={f.Name} Icon={Icon} />
              </StorageCardWrapper>
            );
          }
        })}
      </Grid>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        {context.status === FileSelectStatus.default ? (
          <FileListMenuModalContent
            selectedFiles={selectedFiles}
            onClose={onClose}
          />
        ) : (
          <PasteFileMenuModalContent onClick={paste} onClose={onClose} />
        )}
      </Modal>
    </>
  );
}
