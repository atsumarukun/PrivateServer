import FileCard from "@/components/parts/FileCard";
import ImageCard from "@/components/parts/ImageCard";
import { StorageProps } from "@/constants/props";
import { Grid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { AiFillFolder, AiFillFile } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { MdMovie } from "react-icons/md";
import StorageCardWrapper from "../parts/StorageCardWrapper";
import { MouseEvent, useState } from "react";

export default function FileList({ files }: StorageProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const router = useRouter();

  const onClick = (
    fileName: string,
    mimeType: string,
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
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

  return (
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
              onClick={(e) => onClick(f.Name, f.MimeType, e)}
              border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
              key={i}
            >
              <ImageCard
                href={`${process.env.NEXT_PUBLIC_STORAGE}${
                  router.query.path ?? ""
                }/${f.Name}`}
                fileName={f.Name}
              />
            </StorageCardWrapper>
          );
        } else if (f.MimeType === "dir") {
          return (
            <StorageCardWrapper
              onClick={(e) => onClick(f.Name, f.MimeType, e)}
              border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
              key={i}
            >
              <FileCard
                href={`?path=${router.query.path ?? ""}/${f.Name}`}
                fileName={f.Name}
                Icon={AiFillFolder}
              />
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
              onClick={(e) => onClick(f.Name, f.MimeType, e)}
              border={selectedFiles.includes(f.Name) ? "solid 2px gray" : ""}
              key={i}
            >
              <FileCard
                href={`${process.env.NEXT_PUBLIC_STORAGE}${
                  router.query.path ?? ""
                }/${f.Name}`}
                fileName={f.Name}
                Icon={Icon}
              />
            </StorageCardWrapper>
          );
        }
      })}
    </Grid>
  );
}
