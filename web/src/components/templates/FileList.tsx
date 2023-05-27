import IconCard from "@/components/parts/IconCard";
import ImageCard from "@/components/parts/ImageCard";
import { FileProps, StorageProps } from "@/constants/props";
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
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { ContextMenuStatus, FileSelectStatus } from "@/constants/status";
import { StorageContext } from "@/providers/storageProvider";
import FileListMenuModalContent from "./ModalContents/FileListMenuModalContent";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import PreviewFileModalContent from "./ModalContents/PreviewFileModalContent";
import CreateDirModalContent from "./ModalContents/CreateDirModalContent";
import UploadFileModalContent from "./ModalContents/UploadFileModalContent";
import ContextMenuModalContent from "./ModalContents/ContextMenuModalContent";

export default function FileList({ files }: StorageProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<FileProps>();
  const [status, setStatus] = useState(ContextMenuStatus.default);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const context = useContext(StorageContext);
  const finalRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const onClick = (file: FileProps, e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      // ファイル選択(ctrlを押しながらクリック)
      setSelectedFiles((files) =>
        files.includes(file.Name)
          ? files.filter((v) => v !== file.Name)
          : [...files, file.Name]
      );
    } else {
      if (
        context.globalFiles.length &&
        context.status === FileSelectStatus.default
      ) {
        // 選択ファイル変更(通常クリック)
        setSelectedFiles([file.Name]);
      } else {
        // ファイル表示(通常クリック)
        if (file.MimeType === "dir") {
          router.push({
            query: `path=${router.query.path ?? ""}/${file.Name}`,
          });
        } else {
          setPreviewFile(file);
          onOpen();
        }
        setSelectedFiles([]);
      }
    }
  };

  const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPreviewFile(undefined);
    onOpen();
  };

  const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    const query = `keys[]=${router.query.path ?? ""}/${selectedFiles.join(
      `&keys[]=${router.query.path ?? ""}/`
    )}`;
    if (e.key === "Delete") {
      const res = await axios.delete(`/api/storage/remove?${query}`);
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

  const onDrop = useCallback(
    async (files: File[]) => {
      const formData = new FormData();
      formData.append("file", files[0]);
      const res = await axios.post(
        `/api/storage/upload?path=${router.query.path ?? "/"}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
    },
    [router, toast]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const paste = async () => {
    if (context.status === FileSelectStatus.copy) {
      const query = `keys[]=${context.filePath}/${context.globalFiles.join(
        `&keys[]=${context.filePath}/`
      )}`;
      const res = await axios.put(
        `/api/storage/copy?${query}`,
        JSON.stringify({ path: router.query.path ?? "/" }),
        { headers: { "Content-Type": "application/json" } }
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
    } else if (context.status === FileSelectStatus.move) {
      const query = `keys[]=${context.filePath}/${context.globalFiles.join(
        `&keys[]=${context.filePath}/`
      )}`;
      const res = await axios.put(
        `/api/storage/move?${query}`,
        JSON.stringify({ path: router.query.path ?? "/" }),
        { headers: { "Content-Type": "application/json" } }
      );
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

  const changePreviewFile = (dIndex: number) => {
    if (!previewFile) return;
    const fs = files.filter((f) => f.MimeType !== "dir");
    const index = fs.indexOf(previewFile);
    if (0 < index && dIndex < 0) {
      setPreviewFile(fs[index + dIndex]);
    } else if (index < fs.length - 1 && 0 < dIndex) {
      setPreviewFile(fs[index + dIndex]);
    }
  };

  const handleClose = () => {
    setStatus(ContextMenuStatus.default);
    setPreviewFile(undefined);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <>
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
        <Box
          position="fixed"
          h="100vh"
          w="100vw"
          top="0"
          left="0"
          tabIndex={0}
          onClick={() => setSelectedFiles([])}
          onContextMenu={(e) => onContextMenu(e)}
          onKeyDown={(e) => keyboardPaste(e)}
        >
          <Box {...getRootProps()} h="100%" w="100%">
            <input {...getInputProps()} />
          </Box>
        </Box>
        {files?.map((f, i) => {
          if (f.MimeType.includes("image")) {
            return (
              <StorageCardWrapper
                tabIndex={0}
                fileName={f.Name}
                onKeyDown={(e) => onKeyDown(e)}
                onClick={(e) => onClick(f, e)}
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
                onClick={(e) => onClick(f, e)}
                border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
                key={i}
              >
                <IconCard text={f.Name} Icon={AiFillFolder} />
              </StorageCardWrapper>
            );
          } else {
            let Icon: IconType;
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
                onClick={(e) => onClick(f, e)}
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
        onClose={handleClose}
        isCentered
        size={previewFile ? "6xl" : "md"}
      >
        <ModalOverlay />
        {previewFile ? (
          <PreviewFileModalContent
            file={previewFile}
            onClick={(dIndex) => changePreviewFile(dIndex)}
          />
        ) : selectedFiles.length || context.globalFiles.length ? (
          <FileListMenuModalContent
            selectedFiles={selectedFiles}
            onClose={handleClose}
            paste={paste}
          />
        ) : (
          <>
            {status === ContextMenuStatus.default && (
              <ContextMenuModalContent onClick={setStatus} />
            )}
            {status === ContextMenuStatus.create && (
              <CreateDirModalContent onClose={handleClose} />
            )}
            {status === ContextMenuStatus.upload && <UploadFileModalContent />}
          </>
        )}
      </Modal>
    </>
  );
}
