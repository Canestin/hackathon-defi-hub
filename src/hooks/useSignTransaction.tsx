import {
  useSignTransaction,
  useRequestAccount,
} from "@ledgerhq/wallet-api-client-react";
import { useCallback, useState, useEffect } from "react";
import BigNumber from "bignumber.js";

function useTransactionSigner() {
  const { requestAccount, account } = useRequestAccount();
  const { signTransaction, pending, signature, error } = useSignTransaction();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    requestAccount();
  }, [requestAccount]);

  const handleSignTransaction = useCallback(async () => {
    if (!account) return;

    const ethereumTransaction = {
      family: "ethereum",
      amount: new BigNumber(1000000000000000), // 0.001 ETH in wei
      recipient: "0xRecipientAddressHere",
      gasPrice: new BigNumber(20000000000), // 20 Gwei
      gasLimit: new BigNumber(21000),
      nonce: 0, // Replace with the correct nonce
    } as any;

    try {
      const signature = await signTransaction(account.id, ethereumTransaction);
      setResponse(signature);
    } catch (e) {
      console.error(e);
    }
  }, [account, signTransaction]);

  return {
    handleSignTransaction,
    pending,
    response,
    error,
  };
}

export default useTransactionSigner;
