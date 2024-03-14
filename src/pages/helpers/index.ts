import { hardData } from "./data";

var assetsImages = []; // { ticker: image }

export type Asset = {
  protocol: string;
  currency: string;
  amount: number;
  USD: number;
};

export type Native = {
  validatorPubKey: string;
  validatorIndex: number;
  status: string;
  effectiveBalance: string;
  rewards: string;
  isFinalized: boolean;
  isSlashed: boolean;
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

var address_demo = "0xd8d38f9a38397d7613b2ad79661894a715133964";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatUSD = (amount: number) => {
  const r = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return r.replace("$", "");
};

const getIcons = (id) => {};

const getStakes = async () => {
  // const res = await fetch(
  //   `https://atlas-stg.ledger-test.com/blockchain/v4/eth/address/${address_demo}/stakes`
  // );

  // return res.json();

  return {
    native: [
      {
        validatorPubKey:
          "0x8184f13f96b66a2cd9e50f1bf28e81fd835d2a76b84dbe712c1b93e5575454178d558b6d64dc42d7e6e1031ed28ce755",
        validatorIndex: 63169,
        status: "ACTIVE_ONGOING",
        effectiveBalance: "32000000000",
        rewards: "62477388",
        isFinalized: false,
        isSlashed: false,
      },
    ],
    eigenLayer: {
      "0xf951e335afb289353dc249e82926178eac7ded78": "2099156784158798030",
      "0xac3e018457b222d93114458476f3e3416abbe38f": "1000000000000000000",
    },
    aave: {
      "0x5e8c8a7243651db1384c0ddfdbe39761e8e7e51a": "200000728362342975554",
      "0x72e95b8931767c79ba4eee721354d6e99a61d004": "779905910",
    },
  };
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
  const result = data.map((d) => d.USD).reduce((curr, acc) => acc + curr);
  return formatUSD(result);
};

const formatNative = async (data: Array<Native>) => {
  const answer = [];
  for (const native of data) {
    const totalAmount =
      Number(native.rewards) + Number(native.effectiveBalance);
    const usd = await convertAmounttoUSD(totalAmount, 9);

    const amount = totalAmount / Math.pow(10, 9);

    answer.push({
      protocol: "Native",
      currency: "ETH",
      amount: Number(amount.toFixed(6)),
      USD: Number(usd.toFixed(2)),
    });
  }

  return answer;
};

const formatProtocol = async (data, name: string) => {
  const answer = [];
  for (const tokenAddress in data) {
    const amount = Number(data[tokenAddress]);

    const res1 = await fetch(
      `http://crypto-assets-service.api.ledger.com/v1/tokens?search=${tokenAddress}&output=id,decimals,ticker`
    );

    let tokensResult = (await res1.json()) ?? [];

    tokensResult = tokensResult.filter((t: any) => t.id.startsWith("ethereum"));

    if (tokensResult.length === 0) {
      continue;
    }

    const { id, decimals, ticker } = tokensResult[0];

    const res2 = await fetch(
      `https://countervalues.live.ledger.com/v3/spot/detailed?froms=${id}&to=usd`
    );

    const { rates } = await res2.json();

    const normalizedAmount = amount / Math.pow(10, decimals);
    const usd = normalizedAmount * rates[id].rate;

    answer.push({
      protocol: capitalize(name),
      currency: ticker,
      amount: Number(normalizedAmount.toFixed(6)),
      USD: Number(usd.toFixed(2)),
    });
  }

  return answer;
};

const formatData = async (data: any) => {
  if (!data) {
    return { result: [], protocols: [] };
  }

  const result = [];
  const protocols = [];

  for (const protocol in data) {
    protocols.push(protocol);
    let r;
    if (protocol === "native") {
      r = await formatNative(data["native"]);
    } else {
      r = await formatProtocol(data[protocol], protocol);
    }

    if (r) {
      result.push(...r);
    }
  }

  return { result, protocols };
};

export {
  getStakes,
  convertAmounttoUSD,
  formatNative,
  getTotalAssets,
  formatProtocol,
  formatData,
};
