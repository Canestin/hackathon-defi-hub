import "@/styles/globals.css";
import type { AppProps } from "next/app";
import TransportProvider from "../TransportProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TransportProvider>
      <Component {...pageProps} />;
    </TransportProvider>
  );
}
