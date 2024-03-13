export type Native = {
  validatorPubKey: string;
  validatorIndex: number;
  status: string;
  effectiveBalance: string;
  rewards: string;
  isFinalized: boolean;
  isSlashed: boolean;
};

type Protocol = {
  [key: string]: string;
};

export type EigenLayerResponse = {
  contract_address: string;
  decimals: number;
  name: string;
  ticker: string;
  units: [
    {
      code: string;
      name: string;
      magnitude: number;
    }
  ];
};

export type Asset = {
  protocol: string;
  currency: string;
  amount: number;
  USD: number;
};

const dashboardTitles = ["Protocol", "Currency", "Amount", "USD"];
var address_demo = "0xd8d38f9a38397d7613b2ad79661894a715133964";

const getStakes = async () => {
  const res = await fetch(
    `https://atlas-stg.ledger-test.com/blockchain/v4/eth/address/${address_demo}/stakes`
  );

  return res.json();
};

const convertAmounttoUSD = async (amount: number, decimal: number) => {
  const { ethereum: rate } = await getRateETHtoUSD();
  const usd = (amount / Math.pow(10, decimal)) * rate;
  return usd;
};

const getRateETHtoUSD = async () => {
  const res = await fetch(
    "https://countervalues.live.ledger.com/v3/spot/simple?froms=ethereum&to=USD"
  );
  return res.json();
};

const getTotalAssets = (data: Array<Asset>) => {
  return data.map((d) => d.USD).reduce((curr, acc) => acc + curr);
};

const formatNative = async (data: Array<Native>) => {
  const answer = [];
  for (const native of data) {
    const totalAmount =
      Number(native.rewards) + Number(native.effectiveBalance);
    const usd = await convertAmounttoUSD(totalAmount, 9);

    const amount = totalAmount / Math.pow(10, 9);

    answer.push({
      protocol: "native",
      currency: "ETH",
      amount: amount.toFixed(6),
      USD: usd.toFixed(2),
    });
  }

  return answer;
};

const formatProtocol = async (data, name: string) => {
  const answer = [];
  for (const tokenAddress in data) {
    // const tokenAddress = prop;
    const amount = data[tokenAddress];

    console.log("tokenAddressid", tokenAddress);

    console.log(
      "url",
      `https://crypto-assets-service.api.ledger.com/v1/tokens?network=ethereum&contract_address=${tokenAddress}&output=id,decimals,ticker`
    );

    const res1 = await fetch(
      `https://crypto-assets-service.api.ledger.com/v1/tokens?network=ethereum&contract_address=${tokenAddress}&output=id,decimals,ticker`
    );

    console.log("res1", res1);

    // const { id, decimals, ticker } = await res1.json();
    const xxx = await res1.json();

    // console.log("id", id);
    // console.log("decimals", decimals);
    // console.log("ticker", ticker);
    console.log("xxx", xxx);

    const res2 = await fetch(
      `https://countervalues.live.ledger.com/v3/spot/detailed?froms=${id}&to=usd`
    );

    // const { rates } = await res2.json();
    // const rate = rates[id].rate;
    // const normalizedAmount = amount / Math.pow(10, decimals);
    // const usd = normalizedAmount * rate;

    // answer.push({
    //   protocol: name,
    //   currency: ticker,
    //   amount: normalizedAmount,
    //   USD: usd.toFixed(2),
    // });
  }
};

const formatData = async (data: any) => {
  if (!data) {
    return [];
  }

  const result = [];

  for (const protocol in data) {
    let r;
    if (protocol === "native") {
      r = await formatNative(data["native"]);
    } else {
      r = await formatProtocol(data[protocol], protocol);
    }

    if (r) {
      result.push(...r);
      console.log("r de chez r", ...r);
    }
  }
  console.log("result de chez result", result);

  return result.flatMap((v) => v);
};

export {
  dashboardTitles,
  address_demo,
  getStakes,
  convertAmounttoUSD,
  formatNative,
  getTotalAssets,
  formatProtocol,
  formatData,
};

// getTokenInfos1 : https://crypto-assets-service.api.ledger.com/v1/tokens?network=ethereum&contract_address=0xf951e335afb289353dc249e82926178eac7ded78&output=id,decimals,ticker
// getTokenInfos2: https://countervalues.live.ledger.com/v3/spot/detailed?froms=ethereum/erc20/alphakek_ai&to=usd
