import "@/styles/globals.css";
import "ress";
import type { AppProps } from "next/app";
import Header from "@/components/templates/header";
import { ChakraProvider, Container } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Container maxW="80%">
        <Header />
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}
