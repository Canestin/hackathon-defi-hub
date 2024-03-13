import { useAccounts } from "@ledgerhq/wallet-api-client-react";

function useUserAccounts() {
  const { accounts, loading, error } = useAccounts();

  return {
    accounts,
    loading,
    error,
  };
}

export default useUserAccounts;
