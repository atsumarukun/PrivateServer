import IconCard from "@/components/parts/IconCard";
import ImageCard from "@/components/parts/ImageCard";
import { StorageProps } from "@/constants/props";
import { Box, Grid, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { AiFillFolder, AiFillFile } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { MdMovie } from "react-icons/md";
import StorageCardWrapper from "../parts/StorageCardWrapper";
import { KeyboardEvent, MouseEvent, useState } from "react";

export default function FileList({ files }: StorageProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
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
        !selectedFiles.length ||
        JSON.stringify(selectedFiles) === JSON.stringify([fileName])
      ) {
        // ファイル表示(通常クリック)
        if (mimeType === "dir") {
          router.push({ query: `path=${router.query.path ?? ""}/${fileName}` });
        } else {
          document.location.href = `${process.env.NEXT_PUBLIC_STORAGE}${
            router.query.path ?? ""
          }/${fileName}`;
        }
        setSelectedFiles([]);
      } else {
        // 選択ファイル変更(通常クリック)
        setSelectedFiles([fileName]);
      }
    }
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
    }
    router.reload();
  };

  return (
    <>
      <Box
        position="absolute"
        h="100vh"
        w="100vw"
        top="0"
        left="0"
        onClick={() => setSelectedFiles([])}
      ></Box>
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
    </>
  );
}
