import { GetServerSidePropsContext } from "next";
import FileList from "@/components/templates/FileList";
import { StorageProps } from "@/constants/props";

export default function Storage({ files }: StorageProps) {
  return (
    <main>
      <FileList files={files} />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage?path=${
      context.query.path ?? "/"
    }`
  );
  const data = await res.json();
  return { props: data };
}
