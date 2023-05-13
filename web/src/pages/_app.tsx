import "@/styles/globals.css";
import "ress";
import type { AppProps } from "next/app";
import Header from "@/components/templates/Header";
import { ChakraProvider, Container } from "@chakra-ui/react";
import StorageProvider from "@/providers/storageProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <StorageProvider>
        <Container maxW="80%" p="0">
          <Header />
          <Component {...pageProps} />
        </Container>
      </StorageProvider>
    </ChakraProvider>
  );
}
