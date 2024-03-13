import { WalletAPIProvider } from "@ledgerhq/wallet-api-client-react";
import { Transport, WindowMessageTransport } from "@ledgerhq/wallet-api-client";
import {
  getSimulatorTransport,
  profiles,
} from "@ledgerhq/wallet-api-simulator";

function TransportProvider({ children }: any) {
  function getWalletAPITransport(): Transport {
    if (typeof window === "undefined") {
      return {
        onMessage: undefined,
        send: () => {},
      };
    }

    // Use Simulator transport
    //cconst transport = getSimulatorTransport(profiles.STANDARD);

    // Use real transport (I think but not sure)
    const transport = new WindowMessageTransport();
    transport.connect();

    return transport;
  }

  const transport = getWalletAPITransport();

  return (
    <WalletAPIProvider transport={transport}>{children}</WalletAPIProvider>
  );
}

export default TransportProvider;
