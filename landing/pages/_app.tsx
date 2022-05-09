import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layouts/default";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "../connectors/coinbaseWallet";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect";

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];

function Apinator({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
  );
}

export default Apinator;
