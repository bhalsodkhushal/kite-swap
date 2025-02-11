import React from "react";
export default function Header({ account }) {
  return (
    <header className="headerwrap w-full bg-white text-white py-4 px-6 flex flex-wrap justify-between items-center border-gray-200 border-b">
      <h1 className="logowrap">Swap Token + KiteAI</h1>

      <div className="flex items-center space-x-4">
        <span className="text-black">
          <span className="text-black font-medium">Conversation Rate:</span> 1
          KITE = 2 USDT
        </span>
        {account && (
          <span className="font-medium border rounded-md transition-all duration-300 flex items-center justify-center bg-gradient-to-t from-[#0077FF] to-[#0077FF] text-white text-md py-2 px-5 cursor-pointer">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        )}
      </div>
    </header>
  );
}
