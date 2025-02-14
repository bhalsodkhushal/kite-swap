import React from "react";
export default function Header() {
  return (
    <header className="headerwrap w-full bg-white text-white py-4 px-6 flex flex-wrap justify-between items-center border-gray-200 border-b">
      <h1 className="logowrap">Swap Token + KiteAI</h1>

      <div className="flex items-center space-x-4">
        <span className="text-black">
          <span className="text-black font-medium">Conversation Rate:</span> 1
          KITE = 2 USDT
        </span>
        <appkit-button></appkit-button>
      </div>
    </header>
  );
}
