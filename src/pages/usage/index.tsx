import React from "react";
import { Inter } from "next/font/google";
import useUserAccounts from "@/hooks/useAccounts";
import useTransactionSigner from "@/hooks/useSignTransaction";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { accounts, loading, error } = useUserAccounts();
  const {
    handleSignTransaction,
    pending,
    response,
    error: signError,
  } = useTransactionSigner();

  return (
    <main className={`${inter.className}`}>
      <h1>User's Crypto Accounts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        // @ts-ignore
        <p>Error: {error.message}</p>
      ) : (
        <ul>
          {(accounts ?? []).map(({ id, name, address, currency, balance }) => (
            <li key={id}>
              <p>id: {id}</p>
              <p>name: {name}</p>
              <p>address: {address}</p>
              <p>currency: {currency}</p>
              {/* Make sure to parse BigNumber */}
              <p>balance: {balance.toString()}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleSignTransaction} disabled={pending}>
        Sign Ethereum Transaction
      </button>

      {pending && <p>Signing...</p>}
      {signError && <p>Error: {signError.toString()}</p>}
      {response && (
        <p>Transaction signed successfully: {response.toString("hex")}</p>
      )}
    </main>
  );
}
