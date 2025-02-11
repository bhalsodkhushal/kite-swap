import { useState, useEffect } from "react";
import { ethers, parseEther, formatEther } from "ethers";

import Header from "./components/Header";
import "./index.css";

import SWAP_CONTRACT_ABI from "../abis/Swap.json";
import USDT_TOKEN_CONTRACT_ABI from "../abis/usdtToken.json";

const SWAP_CONTRACT_ADDRESS = "0x4CF14f0e500B5Cbc15D8123225Ae40cca8683974";
const KITE_TESTNET_CHAIN_ID = 2368;

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [kiteBalance, setKiteBalance] = useState("0.0");
  const [usdtBalance, setUsdtBalance] = useState("0.0");

  const [kiteAmount, setKiteAmount] = useState("1");
  const [usdtAmount, setUsdtAmount] = useState("2");

  const [usdtContract, setUsdtContract] = useState(null);
  const [usdtAddress, setUsdtAddress] = useState(
    "0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63"
  );

  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const { chainId } = await provider.getNetwork();

      if (parseInt(chainId) !== KITE_TESTNET_CHAIN_ID) {
        setError("Wrong network! Please switch to KiteAI Testnet.");
        return;
      }

      setProvider(provider);

      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const rawKiteBalance = await provider.getBalance(userAddress);
      const kiteInEther = formatEther(rawKiteBalance);
      console.log(kiteInEther);

      const swapContract = new ethers.Contract(
        SWAP_CONTRACT_ADDRESS,
        SWAP_CONTRACT_ABI,
        signer
      );
      setContract(swapContract);

      const tokenContract = new ethers.Contract(
        usdtAddress,
        USDT_TOKEN_CONTRACT_ABI,
        signer
      );
      setUsdtContract(tokenContract);

      setError("");
    }
  };

  useEffect(() => {
    fetchTokenBalances();
  }, [provider, account, usdtContract]);

  // Fetche Balance
  const fetchTokenBalances = async () => {
    if (!provider || !account || !usdtContract) return;

    try {
      const rawKiteBalance = await provider.getBalance(account);
      const kiteInEther = formatEther(rawKiteBalance);
      setKiteBalance(kiteInEther);

      const rawUsdtBalance = await usdtContract.balanceOf(account);
      const usdtInEther = formatEther(rawUsdtBalance);
      setUsdtBalance(usdtInEther);
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  };

  // Swap KITE (native token) -> USDT
  const swapKiteToUsdt = async () => {
    if (!contract) return alert("Connect wallet first.");

    try {
      // parse the user input as an Ether value (in Wei)
      const valueInWei = parseEther(kiteAmount);

      const tx = await contract.swapNativeForUsdt({
        value: valueInWei, // pass the native token amount as msg.value
      });
      await tx.wait();

      alert(`Successfully swapped ${kiteAmount} KITE for USDT.`);
      setKiteAmount("");
      fetchTokenBalances();
    } catch (error) {
      console.error("Swap KITE->USDT Error:", error);
      alert("Swap failed. Check console for details.");
    }
  };

  // Swap USDT -> KITE
  const swapUsdtToKite = async () => {
    if (!contract) return alert("Connect wallet first.");

    try {
      const amt = parseEther(usdtAmount);
      const tx = await contract.swapUsdtForNative(amt);
      await tx.wait();

      alert(`Successfully swapped ${usdtAmount} USDT for KITE.`);
      setUsdtAmount("");
      fetchTokenBalances();
    } catch (error) {
      console.error("Swap USDT->KITE Error:", error);
      alert("Swap failed. Check console for details.");
    }
  };

  //  Approve USDT
  const approveUsdt = async () => {
    if (!usdtContract)
      return alert("USDT contract is not set or wallet not connected.");

    try {
      const amt = parseEther(usdtAmount || "0");
      const tx = await usdtContract.approve(SWAP_CONTRACT_ADDRESS, amt);
      await tx.wait();
      alert(`Approved ${usdtAmount} USDT for swapping.`);
    } catch (error) {
      console.error("Approve Error:", error);
      alert("Approve failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between mainbg">
      <Header account={account} />
      <div className="flex flex-col items-center p-6 flex-1 w-full">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!account ? (
          <button
            onClick={connectWallet}
            className="btn-secondary cursor-pointer mt-24"
          >
            Connect Wallet
          </button>
        ) : (
          <main className="w-full max-w-2xl space-y-8">
            {/* KITE -> USDT */}
            <section className="bg-white rounded p-6 shadow">
              <h2 className="mb-4 flex justify-between items-center">
                <span className="text-xl font-semibold">Swap KITE → USDT</span>
                <span className="text-md">
                  <span className="">Kite Balance : </span>
                  {kiteBalance}
                </span>
              </h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Amount KITE"
                  value={kiteAmount}
                  onChange={(e) => setKiteAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                />
                <button
                  onClick={swapKiteToUsdt}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Swap
                </button>
              </div>
            </section>

            {/* USDT -> KITE */}
            <section className="bg-white rounded p-6 shadow">
              <h2 className="mb-4 flex justify-between items-center">
                <span className="text-xl font-semibold">Swap USDT → KITE</span>
                <span className="text-md">
                  <span className="">USDT Balance : </span>
                  {usdtBalance}
                </span>
              </h2>

              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Amount USDT"
                  value={usdtAmount}
                  onChange={(e) => setUsdtAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                />
                <button
                  onClick={approveUsdt}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Approve
                </button>
              </div>

              <div>
                <button
                  onClick={swapUsdtToKite}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Swap
                </button>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
