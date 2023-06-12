import { Text } from "@chakra-ui/react";
import axios from "axios";

interface Props {
  services: {
    Name: string;
    Status: string;
    ConfigFiles: string;
  }[];
}

export default function Storage({ services }: Props) {
  return (
    <main>
      {services.map((v) => (
        <Text key={v.Name}>{v.Name}</Text>
      ))}
    </main>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/service`
  );
  return { props: res.data };
}
