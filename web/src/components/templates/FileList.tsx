import FileCard from "@/components/parts/FileCard";
import ImageCard from "@/components/parts/ImageCard";
import { StorageProps } from "@/constants/props";
import { Grid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiFillFolder, AiFillFile } from "react-icons/ai";

export default function FileList({ files }: StorageProps) {
  const router = useRouter();

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
            <ImageCard
              href={`${process.env.NEXT_PUBLIC_STORAGE}${
                router.query.path ?? ""
              }/${f.Name}`}
              fileName={f.Name}
              key={i}
            />
          );
        } else if (f.MimeType === "dir") {
          return (
            <FileCard
              href={`?path=${router.query.path ?? ""}/${f.Name}`}
              fileName={f.Name}
              Icon={AiFillFolder}
              key={i}
            />
          );
        } else {
          return (
            <FileCard
              href={`${process.env.NEXT_PUBLIC_STORAGE}/${
                router.query.path ?? ""
              }${f.Name}`}
              fileName={f.Name}
              Icon={AiFillFile}
              key={i}
            />
          );
        }
      })}
    </Grid>
  );
}