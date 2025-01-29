/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton, TransactionButton } from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";
import { client } from "@/app/client";
import { chain } from "@/app/chain";
import { contract } from "@/lib/contract";
import { 
  useActiveAccount, 
  useContractEvents, 
  useReadContract 
} from "thirdweb/react";

export function BuyMeCoffee() {
  const account = useActiveAccount();
  const [buyAmount, setBuyAmount] = useState(0);
  const [message, setMessage] = useState("");

  const { 
    data: totalCoffees, 
    refetch: refetchTotalCoffees 
  } = useReadContract({
    contract: contract,
    method: "getTotalCoffees",
  });

  const { 
    data: contractEvents, 
    refetch: refetchContractEvents 
  } = useContractEvents({ 
    contract: contract,
  });

  const truncateWalletAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const convertDate = (timestamp: bigint) => 
    new Date(Number(timestamp) * 1000).toLocaleString();

  if (!account) return null;

  return (
    <Card className="w-full max-w-md mx-auto text-white">
      <CardHeader>
        <CardTitle className="text-center font-semibold text-2xl text-slate-500">send mony</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <ConnectButton 
            client={client} 
            chain={chain} 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tip Amount
              <span className="text-xs text-muted-foreground ml-2">
                *Must be greater than 0
              </span>
            </label>
            <Input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(Number(e.target.value))}
              step={0.01}
              placeholder="Enter tip amount"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message
            </label>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message..."
              className="w-full"
            />
          </div>

          {message && buyAmount > 0 && (
            <TransactionButton
              transaction={() => prepareContractCall({
                contract: contract,
                method: "buyMeACoffee",
                params: [message],
                value: BigInt(toWei(buyAmount.toString())),
              })}
              onTransactionConfirmed={() => {
                alert("Thank you for the coffee!");
                setBuyAmount(0);
                setMessage("");
                refetchTotalCoffees();
                refetchContractEvents();
              }}
              className="w-full"
            >
send money            </TransactionButton>
          )}
        </div>

        <div className="mt-6">
          <h3 className=" font-semibold text-xl text-slate-500">
            Total Coffees: {totalCoffees?.toString()}
          </h3>
          <div className="space-y-2">
            {contractEvents && contractEvents.length > 0 && (
              [...contractEvents].reverse().map((event, index) => (
                <div 
                  key={index} 
                  className="bg-secondary p-3 rounded-lg"
                >
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>
                      {/* @ts-ignore */}
                      {truncateWalletAddress(event.args.sender)}
                    </span>
                    <span>
                      {/* @ts-ignore */}
                      {convertDate(event.args.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">
                    {/* @ts-ignore */}
                    {event.args.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}