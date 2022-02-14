import type { NextPage } from "next";
import Head from "next/head";
import styles from "./RaffleSection.module.scss";
import { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import RaffleHeader from "../../components/RaffleHeader/RaffleHeader";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import Raffle from "../../components/Raffle/Raffle";
import contractABI from "../../WalletHelpers/contractAbi.json";

const RaffleSection: NextPage = () => {
  const { account, library } = useWeb3React();
  const [number, setNumber] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0.1);

  return (
    <section className={styles.section}>
      <Head>
        <title>AlphaInitium</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className={styles.container}>
        <div className={styles.main}>
          <Row className="d-flex flex-column">
            <RaffleHeader />
          </Row>
          <Row className="d-flex flex-column mt-5">
            <ConnectWallet />
          </Row>
          <Row className="d-flex flex-column mt-3 ">
            {!!account && !!library && <Raffle />}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default RaffleSection;
