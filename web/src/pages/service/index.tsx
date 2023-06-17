import IconCard from "@/components/parts/IconCard";
import { Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import { IconType } from "react-icons";
import { IoIosApps } from "react-icons/io";
import { SiMinecraft } from "react-icons/si";
import { FaServer, FaYoutube } from "react-icons/fa";

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
            <GridItem key={v.Name}>
              <IconCard Icon={Icon} text={v.Name} />
            </GridItem>
          );
        })}
      </Grid>
    </main>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/service`
  );
  return { props: res.data };
}
