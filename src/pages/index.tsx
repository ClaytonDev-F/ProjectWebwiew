// @ts-nocheck
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, useWalletClient, useDisconnect } from "wagmi";
import { createPublicClient, http, getContract } from "viem";
import { bsc } from "viem/chains";
import { parseUnits } from "viem";

const MY_CONTRACT_ADDRESS =
  "0xe92A6c8d1393992c45b97866C81BBFB13D1bd720" as `0x${string}`;
const USDT_CONTRACT_ADDRESS =
  "0x55d398326f99059fF775485246999027B3197955" as `0x${string}`;

const myContractABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "buyTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const usdtContractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function App() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [dollarAmount, setDollarAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const connectButtonRef = useRef(null);
  const { disconnect } = useDisconnect();
    const [isBuying, setIsBuying] = useState(false);


  const usdRaised = 4530;
  const usdGoal = 100000;
  const tokensSold = 453379;
  const tokenGoal = 100000000;

  const barPercentage = 14;

  useEffect(() => {
    if (dollarAmount) {
      const tokens = Number(dollarAmount) / 0.001;
      setTokenAmount(tokens.toString());
    } else {
      setTokenAmount("");
    }
  }, [dollarAmount]);

    const handleBuyTokens = async () => {
        if (!walletClient || !address) return;

        const usdtCost = Number(tokenAmount) * 0.001;
        if (usdtCost <= 0) return;

        setIsBuying(true);
        const publicClient = createPublicClient({
          chain: bsc,
          transport: http(),
        });

        const myContractInstance = getContract({
          address: MY_CONTRACT_ADDRESS,
          abi: myContractABI,
          client: publicClient,
        });

        const usdtContractInstance = getContract({
          address: USDT_CONTRACT_ADDRESS,
          abi: usdtContractABI,
          client: publicClient,
        });

        try {
             await walletClient.writeContract({
                ...usdtContractInstance,
                 functionName: "approve",
                 args: [MY_CONTRACT_ADDRESS, parseUnits(usdtCost.toString(), 18)],
             });

             await walletClient.writeContract({
                ...myContractInstance,
                functionName: "buyTokens",
                args: [parseUnits(tokenAmount.toString(), 18)],
            });

            console.log("Tokens comprados com sucesso!");
            setError("");
            setIsBuying(false);
        } catch (error) {
            setIsBuying(false);
            // The catch block now does absolutely nothing
          return null
        }
    };



  const handleMaxClick = () => {
    setDollarAmount("1000");
  };

  const handleExampleClick = () => {
    console.log("Botão Exemplo clicado!");

    if (connectButtonRef.current) {
      connectButtonRef.current.click();
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>
          <style>
        {`
          input:focus {
            outline: none;
            box-shadow: none;
          }
        `}
      </style>
      <div className="w-full max-w-[400px] px-4 sm:px-6 md:px-15">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full">
            <div className="mb-2 text-center">
              <div
                className="mb-0 mt-5 font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200"
                style={{ fontSize: "25px" }}
              >
                XSTP Presale
              </div>
            </div>
            <div
              className="text-center text-xs mt-0 mb-0.5"
              style={{ fontSize: "18px" }}
            >
              Stage 1
            </div>
            <div className="text-center mt-1 mb-0" style={{ fontSize: "15px" }}>
              1 XSTP : $ 0,001
            </div>
            <div
              className="text-center mt-1 mb-3"
              style={{ fontSize: "15px" }}
            >
              Next Stage Price = $ 0.002
            </div>

            <div className="mb-4">
              <div className="w-full h-[25px] bg-white rounded-[4px] overflow-hidden relative">
                <div
                  className="h-full absolute left-0 top-0 flex items-center justify-center"
                  style={{
                    width: `${barPercentage}%`,
                    background:
                      "linear-gradient(90deg, #169889 0%, #00bcab 100%)",
                    border: "3px solid white",
                    boxSizing: "border-box",
                  }}
                >
                  {barPercentage > 5 && (
                    <span className="text-white text-sm font-bold">
                      {barPercentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <div>
                USD Raised: ${usdRaised.toLocaleString()} / $
                {usdGoal.toLocaleString()}
              </div>
              <div>
                Tokens Sold: {tokensSold.toLocaleString()} /{" "}
                {tokenGoal.toLocaleString()}
              </div>
            </div>

            <div className="flex space-x-2 mb-4 mt-4">
              <button
                onClick={() => setSelectedPayment("BNB")}
                className={`flex-1 h-12 font-normal text-white border border-white rounded ${
                  selectedPayment === "BNB"
                    ? "bg-gradient-to-r from-teal-500 to-teal-700"
                    : "bg-transparent"
                } transition-colors`}
              >
                BNB
              </button>
              <button
                onClick={() => setSelectedPayment("USDT")}
                className={`flex-1 h-12 font-normal text-white border border-white rounded ${
                  selectedPayment === "USDT"
                    ? "bg-gradient-to-r from-teal-500 to-teal-700"
                    : "bg-transparent"
                } transition-colors`}
              >
                USDT
              </button>
              <button
                onClick={() => setSelectedPayment("CREDITO")}
                className={`flex-1 h-12 font-normal text-white border border-white rounded ${
                  selectedPayment === "CREDITO"
                    ? "bg-gradient-to-r from-teal-500 to-teal-700"
                    : "bg-transparent"
                } transition-colors`}
              >
                CREDITO
              </button>
            </div>

            <div className="mb-1 text-sm">Amount in USDT You Pay:</div>
            <div className="flex space-x-2 mb-4">
              <input
                type="number"
                placeholder="Investment value"
                className="flex-grow h-12 px-4 text-black rounded border border-gray-300 mb[-5] focus:outline-none focus:ring-0 focus:ring-blue-500"
                value={dollarAmount}
                onChange={(e) => setDollarAmount(e.target.value)}
                 style={{fontWeight: 'bold'}}
              />
              <button
                onClick={handleMaxClick}
                className="w-24 h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold border border-white rounded"
              >
                MAX
              </button>
            </div>

            <div
              className="mb-1 mt-[-5] text-sm bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 text-white"
            >
              Amount in XSTP You Receive:
            </div>
            <input
              type="number"
              placeholder=""
              className="mb-4 w-full h-12 px-4 text-black rounded border border-gray-300 bg-gray-100 cursor-not-allowed"
              value={tokenAmount}
               style={{fontWeight: 'bold'}}
              readOnly
            />
            {address && (
              <button
                 onClick={handleBuyTokens}
                  className={`w-full h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold py-2 px-12 rounded ${isBuying ? 'opacity-50 cursor-not-allowed' : ''}`}
                 disabled={isBuying}
              >
                {isBuying ? 'Buying...' : 'Buy Token'}
              </button>
            )}
            {!address && (
              <button
                onClick={handleExampleClick}
                className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold py-2 px-12 rounded mt-4"
              >
                Connect Wallet 
              </button>
            )}
            {address && (
              <button
                onClick={handleDisconnect}
                className="w-full h-8 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded mt-2 text-xs"
              >
                Disconnect
              </button>
            )}
            {error && <div className="mt-4 text-red-500">Erro: {error}</div>}
          </div>
          <div className="mt-4" style={{ display: "none" }}>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            ref={connectButtonRef}
                            onClick={openConnectModal}
                            type="button"
                            className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold py-2 px-12 rounded"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold py-2 px-12 rounded mt-4"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="mt-4 space-y-4">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold py-2 px-12 rounded flex items-center justify-center"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 24,
                                  height: 24,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: 8,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    style={{ width: 24, height: 24 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-gradient-to-l text-white font-bold py-2 px-12 rounded"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ""}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;