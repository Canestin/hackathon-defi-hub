import React, { useCallback, useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Asset, formatData, getStakes, getTotalAssets } from "./helpers";
import Image from "next/image";
import { SiProtocolsdotio, SiWebmoney } from "react-icons/si";
import { MdCurrencyLira } from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [totalAssets, setTotalAssets] = useState(null);
  const [assetsByProtocol, setAssetsByProtocol] = useState(null);
  const [data, setData] = useState<Array<Asset>>([]);
  const [hide, setHide] = useState(false);
  const [dataFiltered, setDataFiltered] = useState<Array<Asset>>([]);
  const [protocols, setProtocols] = useState<Array<string>>([]);

  console.log("dataFiltered", dataFiltered);
  useEffect(() => {
    const getData = async () => {
      const stakes = await getStakes();
      const { result, protocols } = await formatData(stakes);
      const total = getTotalAssets(result);
      setData(result);
      setDataFiltered(result);
      setProtocols(protocols);
      setTotalAssets(total);
    };

    getData();
  }, []);

  const filterData = useCallback(
    (p: string) => {
      console.log("p de chez p", p);
      console.log("data de chez data", data);
      const ans = data.filter(
        (d) => d.protocol.toLowerCase() == p.toLowerCase()
      );
      const assetsByProto = getTotalAssets(ans);
      setAssetsByProtocol(assetsByProto);
      setDataFiltered(ans);
    },
    [data]
  );

  console.log("hide chez hide", hide);

  return (
    <main className={`${inter.className} h-screen p-20`}>
      <div className="">
        <div className="flex justify-between items-center mb-16">
          <h1 className="font-bold text-4xl text-white">
            Total delegated Assets Dashboard
          </h1>
          <div
            onClick={() => setHide((v) => !v)}
            className="rounded-md cursor-pointer bg-purple-300 px-3 py-1 hover:bg-purple-400"
          >
            {hide ? "Display data" : "Hide data"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-6 flex flex-col gap-3">
            <h3 className="text-secondary font-bold">Total delegated</h3>
            <h1 className="text-3xl font-bold text-purple-300">
              $ {hide ? "***" : totalAssets ?? "---"}
            </h1>
            <h4 className="text-secondary">{data?.length ?? ""} Assets</h4>
          </div>
          <div className="bg-neutral-800 rounded-lg p-6 flex flex-col gap-3">
            <div className="flex gap-2">
              <div
                className="bg-purple-300 !text-black px-3 py-[2px] rounded text-secondary cursor-pointer hover:bg-purple-500"
                onClick={() => {
                  setAssetsByProtocol(null);
                  setDataFiltered(data);
                }}
              >
                ALL
              </div>

              {protocols.map((p, index) => (
                <div
                  key={`proto-${index}`}
                  className="bg-green-600 !text-white px-3 py-[2px] rounded text-secondary cursor-pointer hover:bg-green-800"
                  onClick={() => filterData(p)}
                >
                  {p.toUpperCase()}
                </div>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-purple-300">
              $ {hide ? "***" : assetsByProtocol ?? "---"}
            </h1>
            <h4 className="text-secondary">
              {dataFiltered?.length ?? ""} Assets
            </h4>
          </div>
        </div>
        <h1 className="mb-14 font-bold text-2xl mt-12 text-white">
          Delegated Assets
        </h1>

        <div className="">
          <div className="grid grid-cols-4 border-b pb-3 mb-10 pl-4">
            <div className="text-secondary flex items-center gap-2">
              <SiProtocolsdotio color="rgb(216 180 254)" />{" "}
              <span>Protocol</span>
            </div>
            <div className="text-secondary flex items-center gap-2">
              <MdCurrencyLira color="rgb(216 180 254)" /> <span>Currency</span>
            </div>
            <div className="text-secondary flex items-center gap-2">
              <SiWebmoney color="rgb(216 180 254)" /> <span>Amount</span>
            </div>
            <div className="text-secondary flex items-center gap-2">
              <HiOutlineCurrencyDollar color="rgb(216 180 254)" />{" "}
              <span>USD</span>
            </div>
          </div>

          <div className="pb-3">
            {dataFiltered?.map((line, index) => (
              <div
                key={`line-${index}`}
                className="bg-secondary hover:bg-neutral-700 rounded mb-2 p-4 grid grid-cols-4 pb-3 "
              >
                <div className="text-secondary flex items-center gap-2">
                  <Image
                    src={
                      "https://proxycgassets.api.live.ledger.com/coins/images/29337/large/unsheth_large_logo.png"
                    }
                    alt="X"
                    width={30}
                    height={20}
                  />
                  <span>{line.protocol}</span>
                </div>
                <div className="text-secondary">{line.currency}</div>
                <div className="text-secondary">
                  {hide ? "***" : line.amount}
                </div>
                <div className="text-secondary">{hide ? "***" : line.USD}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
