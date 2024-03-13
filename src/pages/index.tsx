import React, { useEffect, useState } from "react";
import useUserAccounts from "../hooks/useAccounts";
import useTransactionSigner from "../hooks/useSignTransaction";
import { Inter } from "next/font/google";
import {
  dashboardTitles,
  formatData,
  formatNative,
  formatProtocol,
  getStakes,
  getTotalAssets,
} from "./helpers";

const inter = Inter({ subsets: ["latin"] });

export type Asset = {
  protocol: string;
  currency: string;
  amount: number;
  USD: number;
};

export default function Home() {
  const [totalAssets, setTotalAssets] = useState(null);
  const [data, setData] = useState<Array<Asset>>([]);
  // const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const stakes = await getStakes();
      const data = await formatData(stakes);
      // const natives = await formatNative(stakes["native"]);
      // const pro = await formatProtocol(stakes["eigenLayer"]);
      const t = getTotalAssets(data);
      setData(data);
      setTotalAssets(t);
    };

    getData();
  }, []);

  return (
    <main className={`${inter.className} h-screen p-20 text-white`}>
      <div className="">
        <h1 className="mb-16 font-bold text-4xl">
          Total delegated Assets Dashboard
        </h1>
        <div className="grid grid-cols-2 gap-8">
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-lg p-6 flex flex-col gap-3"
            >
              <h3 className="text-secondary">Total delegated</h3>
              {/* <h1 className="text-3xl font-bold">$ 100,000</h1> */}
              <h1 className="text-3xl font-bold">$ {totalAssets ?? "***"}</h1>
              <h4 className="text-secondary">4 Assets</h4>
            </div>
          ))}
        </div>
        <h1 className="mb-14 font-bold text-2xl mt-12">Delegated Assets</h1>

        <div className="">
          <div className="grid grid-cols-4 border-b pb-3 mb-10">
            {dashboardTitles.map((title, index) => (
              <h1 key={index} className="text-secondary">
                {title}
              </h1>
            ))}
          </div>

          <div className="pb-3">
            {data?.map((line, index) => (
              <div
                key={`line-${index}`}
                className="bg-secondary rounded mb-2 p-4 grid grid-cols-4 pb-3 "
              >
                <div key={index} className="text-secondary">
                  {line.protocol}
                </div>
                <div key={index} className="text-secondary">
                  {line.currency}
                </div>
                <div key={index} className="text-secondary">
                  {line.amount}
                </div>
                <div key={index} className="text-secondary">
                  {line.USD}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
