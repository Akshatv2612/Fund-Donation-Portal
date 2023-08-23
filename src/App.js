import { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "./ERC20abi.json";
import TxList from "./TxList";
import Navbar from "./Navebar";
// import Footer from "./Footer";

export default function App() {
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [error, setError] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-"
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const erc20 = new ethers.Contract(data.get("addr"), erc20abi, provider);

      const tokenName = await erc20.name();
      const tokenSymbol = await erc20.symbol();
      const totalSupply = await erc20.totalSupply();

      setContractInfo({
        address: data.get("addr"),
        tokenName,
        tokenSymbol,
        totalSupply
      });
      alert("Successful..")
    }
    catch {
      alert("Not able to connect to Metamask");
    }
  };

  const getMyBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const balance = await erc20.balanceOf(signerAddress);

      setBalanceInfo({
        address: signerAddress,
        balance: String(balance)
      });
    }
    catch (e) {
      alert("Connect to Metamask wallet !")
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
      await erc20.transfer(data.get("recipient"), data.get("amount"));
      alert("Donation Successful...Thank you from the bottom of our hearts for your generous donation! Your support will pave the way for brighter futures and empower students to achieve their dreams.")
    }
    catch (e) {
      alert("Transaction Rejected");
    }
  };

  return (
    <div className="mainContainer w-full bg-gray-700">
      <Navbar/>
      <div className=" head mx-auto text-xl font-semibold credit-card text-center w-4/6 m-7 bg-gray-800 rounded-xl p-2 text-white">Fund Donation portal</div>
      <div id="About Us" className=" head mx-auto credit-card text-center w-5/6 m-7 bg-gray-800 rounded-xl p-1 text-gray-300">Welcome to IIT Guwahati's Fund Donation Platform. Through our Fund Donation Platform, we offer a seamless and secure way for individuals, organizations, and alumni to contribute to various causes that directly impact the lives of our students. Each fund is dedicated to specific needs, such as scholarships, educational resources, emergency aid, and more.</div>
      <div className="Upper2BlocksContainer flex flex-wrap justify-center">
        <div className="contractContainer w-3/5 lg:w-2/5">
          <form className="m-4" onSubmit={handleSubmit}>
            <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-blue-200">
              <main className="mt-4 p-4 hidden">
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                  Read from smart contract
                </h1>
                <div className="">
                  <div className="my-3">
                    <input
                      readOnly
                      type="text"
                      name="addr"
                      value='0xbf0894BbE7494449121f08C97d4f9dB3a8bF1bbf'
                      className="input input-bordered block w-full focus:ring focus:outline-none"
                      placeholder="ERC20 contract address"
                    />
                  </div>
                </div>
              </main>
              <footer className="p-4">
                <button
                  id="button1"
                  type="submit"
                  className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                >
                  Connect to metamask Wallet
                </button>
              </footer>
              <div className="px-4 hidden">
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Total supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{contractInfo.tokenName}</th>
                        <td>{contractInfo.tokenSymbol}</td>
                        <td>{String(contractInfo.totalSupply)}</td>
                        <td>{contractInfo.deployedAt}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-4">
                <button
                  onClick={getMyBalance}
                  type="submit"
                  className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                >
                  Get my balance
                </button>
              </div>
              <div className="px-4 pb-4 text-center text-gray-700">
                {balanceInfo.balance}
              </div>
            </div>
          </form>
        </div>
        <div id="Transactions" className="m-4 credit-carde w-3/5 lg:w-4/6  shadow-lg mx-auto rounded-xl bg-gray-800">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-200 text-center">
              Recent transactions
            </h1>
            <p>
              <TxList txs={txs} />
            </p>
          </div>
        </div>
      </div>
      <div className="bg-blue-200 rounded-xl m-4">
        <div id="Donate" className="mx-auto text-xl font-semibold credit-card text-center w-full m-7 bg-gray-800 rounded-xl p-2">Donate to funds</div>
        <div className="flex gap-7 flex-wrap">
          <div className="m-4 credit-card w-3/5 lg:w-2/5 shadow-lg mx-auto rounded-xl bg-white">
            <div className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Technology and Equipment Fund
              </h1>

              <form onSubmit={handleTransfer}>
                <div className="my-3 hidden">
                  <input
                    type="text"
                    name="recipient"
                    value='0x1e67D661d056F352D31Ef7Ec4a9Ca877c57eDCC3'
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Recipient address"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="text"
                    name="amount"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Amount to donate"
                  />
                </div>
                <footer className="p-4">
                  <button
                    type="submit"
                    className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  >
                    Donate
                  </button>
                </footer>
              </form>
            </div>
          </div>
          <div className="m-4 credit-card w-3/5 lg:w-2/5 shadow-lg mx-auto rounded-xl bg-white">
            <div className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Books and Learning Materials Fund
              </h1>

              <form onSubmit={handleTransfer}>
                <div className="my-3 hidden">
                  <input
                    type="text"
                    value='0x1e67D661d056F352D31Ef7Ec4a9Ca877c57eDCC3'
                    name="recipient"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Recipient address"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="text"
                    name="amount"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Amount to donate"
                  />
                </div>
                <footer className="p-4">
                  <button
                    type="submit"
                    className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  >
                    Donate
                  </button>
                </footer>
              </form>
            </div>
          </div>
          <div className="m-4 credit-card w-3/5 lg:w-2/5 shadow-lg mx-auto rounded-xl bg-white">
            <div className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Health emergency fund
              </h1>

              <form onSubmit={handleTransfer}>
                <div className="my-3 hidden">
                  <input
                    type="text"
                    value='0x1e67D661d056F352D31Ef7Ec4a9Ca877c57eDCC3'
                    name="recipient"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Recipient address"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="text"
                    name="amount"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Amount to donate"
                  />
                </div>
                <footer className="p-4">
                  <button
                    type="submit"
                    className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  >
                    Donate
                  </button>
                </footer>
              </form>
            </div>
          </div>
          <div className="m-4 credit-card w-3/5 lg:w-2/5 shadow-lg mx-auto rounded-xl bg-white">
            <div className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Fund for cycle donation
              </h1>

              <form onSubmit={handleTransfer}>
                <div className="my-3 hidden">
                  <input
                    type="text"
                    value='0x1e67D661d056F352D31Ef7Ec4a9Ca877c57eDCC3'
                    name="recipient"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Recipient address"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="text"
                    name="amount"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Amount to donate"
                  />
                </div>
                <footer className="p-4">
                  <button
                    type="submit"
                    className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  >
                    Donate
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div id="Contact Us" className="Footer rounded-md w-4/6 mx-auto p-4 flex flex-col p-4">
      <p className="text-white font-semibold text-lg mx-auto">Contact Us</p>
      <div class="mx-auto text-xl font-semibold credit-card text-center w-4/6 m-7 bg-gray-800 rounded-xl p-2 text-white hover:text-blue-400">
          <p><a href="mailto:iitgfunds@gmail.com">iitgfunds@gmail.com</a></p>
        </div>
        <div class="mx-auto text-xl font-semibold credit-card text-center w-4/6 m-7 bg-gray-800 rounded-xl p-2 text-white hover:text-blue-400">
          <p><a href="https://www.linkedin.com/in/akshat-v26">LinkedIn</a></p>
        </div>
      </div>
    </div>
  );
}
