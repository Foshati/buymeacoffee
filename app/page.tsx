import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 space-y-4">
      <h1 className="text-3xl font-bold">Sending money</h1>
      <ConnectEmbed 
        client={client} 
        chain={chain} 
        className="mb-4" 

      />
      <BuyMeCoffee />
    </div>
  );
}