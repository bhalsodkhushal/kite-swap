import { useState, useEffect } from "react";
import { ethers, parseEther, formatEther, BrowserProvider } from "ethers";
import {
  createAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import "./index.css";

import SWAP_CONTRACT_ABI from "../abis/Swap.json";
import USDT_TOKEN_CONTRACT_ABI from "../abis/usdtToken.json";

const SWAP_CONTRACT_ADDRESS = "0x4CF14f0e500B5Cbc15D8123225Ae40cca8683974";
const KITE_TESTNET_CHAIN_ID = 2368;

// AppKit specific code start
const customNetwork = defineChain({
  id: KITE_TESTNET_CHAIN_ID,
  caipNetworkId: "eip155:2368",
  chainNamespace: "eip155",
  name: "KiteAI Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Kite",
    symbol: "KITE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.gokite.ai/"],
    },
  },
  blockExplorers: {
    default: {
      name: "KiteScan",
      url: "https://testnet.kitescan.ai/",
    },
  },
});

const projectId = "decdce0f2dff78aa2012c38c0072ef06";

const metadata = {
  name: "Swap Token + KiteAI",
  description: "Swap token for KiteAI",
  url: "https://swipe-token-dapp.vercel.app/",
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [customNetwork],
  metadata,
  projectId,
  features: {
    email: false,
    socials: [],
    analytics: true,
    swaps: false,
  },
  themeMode: "light",
});
// AppKit specific code end

function App() {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider("eip155");

  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (!walletProvider) {
      setProvider(null);
      return;
    }
    const brProvider = new BrowserProvider(walletProvider);
    setProvider(brProvider);
  }, [walletProvider]);

  const [kiteBalance, setKiteBalance] = useState("0.0");
  const [usdtBalance, setUsdtBalance] = useState("0.0");

  const [kiteAmount, setKiteAmount] = useState("1");
  const [usdtAmount, setUsdtAmount] = useState("2");

  const [swapContract, setSwapContract] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const usdtAddress = "0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63";

  const [isLoadingKiteToUsdt, setIsLoadingKiteToUsdt] = useState(false);
  const [isLoadingUsdtApprove, setIsLoadingUsdtApprove] = useState(false);
  const [isLoadingUsdtToKite, setIsLoadingUsdtToKite] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!provider || !isConnected) return;

    const setupContracts = async () => {
      try {
        if (parseInt(chainId) !== KITE_TESTNET_CHAIN_ID) {
          setError("Wrong network! Please switch to KiteAI Testnet.");
          return;
        }

        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          SWAP_CONTRACT_ADDRESS,
          SWAP_CONTRACT_ABI,
          signer
        );
        setSwapContract(contractInstance);

        const usdtInstance = new ethers.Contract(
          usdtAddress,
          USDT_TOKEN_CONTRACT_ABI,
          signer
        );
        setUsdtContract(usdtInstance);

        setError("");
      } catch (err) {
        console.error("Setup contract error:", err);
        setError(err.message || "Error setting up contracts");
      }
    };

    setupContracts();
  }, [provider, isConnected, chainId]);

  useEffect(() => {
    fetchTokenBalances();
  }, [provider, address, usdtContract]);

  // Fetche Balance
  const fetchTokenBalances = async () => {
    if (!provider || !address || !usdtContract) return;

    try {
      const rawKiteBalance = await provider.getBalance(address);
      setKiteBalance(formatEther(rawKiteBalance));

      const rawUsdtBalance = await usdtContract.balanceOf(address);
      setUsdtBalance(formatEther(rawUsdtBalance));
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  // Swap KITE -> USDT
  const swapKiteToUsdt = async () => {
    try {
      setIsLoadingKiteToUsdt(true);
      const tx = await swapContract.swapNativeForUsdt({
        value: parseEther(kiteAmount),
      });
      await tx.wait();

      toast(`Successfully swapped ${kiteAmount} KITE for USDT.`);
      setKiteAmount("");
      fetchTokenBalances();
    } catch (error) {
      console.error("Swap KITE->USDT Error:", error);
      toast("Swap failed. Check console for details.");
    } finally {
      setIsLoadingKiteToUsdt(false);
    }
  };

  // Swap USDT -> KITE
  const swapUsdtToKite = async () => {
    try {
      setIsLoadingUsdtToKite(true);
      const amt = parseEther(usdtAmount);
      const tx = await swapContract.swapUsdtForNative(amt);
      await tx.wait();

      toast(`Successfully swapped ${usdtAmount} USDT for KITE.`);
      setUsdtAmount("");
      fetchTokenBalances();
    } catch (error) {
      console.error("Swap USDT->KITE Error:", error);
      toast("Swap failed. Check console for details.");
    } finally {
      setIsLoadingUsdtToKite(false);
    }
  };

  //  Approve USDT
  const approveUsdt = async () => {
    try {
      setIsLoadingUsdtApprove(true);
      const amt = parseEther(usdtAmount || "0");
      const tx = await usdtContract.approve(SWAP_CONTRACT_ADDRESS, amt);
      await tx.wait();
      toast(`Approved ${usdtAmount} USDT for swapping.`);
    } catch (error) {
      console.error("Approve Error:", error);
      toast("Approve failed. Check console for details.");
    } finally {
      setIsLoadingUsdtApprove(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between mainbg">
      <ToastContainer
        position="top-right"
        hideProgressBar
        pauseOnHover
        theme="dark"
      />
      <Header />
      <div className="flex flex-col items-center p-6 flex-1 w-full">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isConnected ? (
          <main className="w-full max-w-2xl space-y-8 mt-8">
            <section className="bg-white rounded p-6 shadow">
              <h2 className="mb-4 flex justify-between items-center">
                <span className="text-xl font-semibold">Swap KITE → USDT</span>
                <span className="text-md">
                  <span>Kite Balance: </span>
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
                  disabled={isLoadingKiteToUsdt}
                  className={`
                  bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer
                  ${isLoadingKiteToUsdt ? "opacity-70 cursor-not-allowed" : ""}
                `}
                >
                  {isLoadingKiteToUsdt ? "Swapping..." : "Swap"}
                </button>
              </div>
            </section>

            <section className="bg-white rounded p-6 shadow">
              <h2 className="mb-4 flex justify-between items-center">
                <span className="text-xl font-semibold">Swap USDT → KITE</span>
                <span className="text-md">
                  <span>USDT Balance: </span>
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
                  disabled={isLoadingUsdtApprove}
                  className={`
                  bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer
                  ${isLoadingUsdtApprove ? "opacity-70 cursor-not-allowed" : ""}
                `}
                >
                  {isLoadingUsdtApprove ? "Approving..." : "Approve"}
                </button>
              </div>

              <div>
                <button
                  onClick={swapUsdtToKite}
                  disabled={isLoadingUsdtToKite}
                  className={`
                  bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer
                  ${isLoadingUsdtToKite ? "opacity-70 cursor-not-allowed" : ""}
                `}
                >
                  {isLoadingUsdtToKite ? "Swapping..." : "Swap"}
                </button>
              </div>
            </section>
          </main>
        ) : (
          <p className="mt-8">Please connect your wallet to swap tokens.</p>
        )}
      </div>
    </div>
  );
}

export default App;
