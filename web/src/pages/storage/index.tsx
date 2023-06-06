import { GetServerSidePropsContext } from "next";
import FileList from "@/components/templates/FileList";
import { StorageProps } from "@/constants/props";
import axios from "axios";
import nookies from "nookies";

export default function Storage({ files }: StorageProps) {
  return (
    <main>
      <FileList files={files} />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage?path=${
      context.query.path ?? "/"
    }`,
    {
      headers: {
        Authorization: `Bearer ${nookies.get(context).token}`,
      },
    }
  );
  return { props: res.data };
}
