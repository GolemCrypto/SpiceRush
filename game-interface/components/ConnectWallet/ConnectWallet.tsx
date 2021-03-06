import { useState, useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import Web3 from "web3";

import {
  useEagerConnect,
  useInactiveListener,
} from "../../WalletHelpers/hooks";
import {
  injected,
  walletconnect,
  walletlink,
} from "../../WalletHelpers/connectors";
import { Col, Button, Dropdown, Spinner, Modal } from "react-bootstrap";
import styles from "./ConnectWallet.module.scss";

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "Install MetaMask on desktop or visit from Metamask app browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network. Connect to Rinkeby TestNet";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

const ConnectWallet = () => {
  const context = useWeb3React<Web3>();
  const { connector, account, activate, deactivate, error } = context;
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
      if (!error) setShowModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  const killSession = () => {
    if (connector === injected) {
      deactivate();
    } else {
      (connector as any).close();
    }
  };

  const toggle = () => setShowModal(!showModal);

  const modalErrorContent = (error: Error) => {
    return (
      <Col className={styles.modalContent}>
        <p>{getErrorMessage(error)}</p>
        <Button
          className="rounded-pill px-5 my-2"
          onClick={() => {
            deactivate();
          }}
        >
          Go back
        </Button>
      </Col>
    );
  };

  const modalContent = () => {
    return (
      <Col className={styles.modalContent}>
        {/* Metamask */}
        <Button
          className={styles.metamask}
          onClick={() => {
            setActivatingConnector(injected);
            activate(injected);
          }}
        >
          <div className={styles.buttonContent}>
            {activatingConnector === injected ? (
              <>
                Connecting...
                <Spinner size="sm" animation="border" />
              </>
            ) : (
              <>
                Metamask
                <img
                  src="assets/metamask.svg"
                  width={30}
                  height={30}
                  alt="logo metamask"
                />
              </>
            )}
          </div>
        </Button>

        {/* WalletConnect */}
        <Button
          className={styles.walletConnect}
          onClick={() => {
            setActivatingConnector(walletconnect);
            activate(walletconnect);
          }}
        >
          <div className={styles.buttonContent}>
            {activatingConnector === walletconnect ? (
              <>
                Connecting...
                <Spinner size="sm" animation="border" />
              </>
            ) : (
              <>
                WalletConnect
                <img
                  src="assets/walletConnect.svg"
                  width={30}
                  height={30}
                  alt="logo metamask"
                />
              </>
            )}
          </div>
        </Button>

        {/* WalletLink */}
        <Button
          className={styles.walletLink}
          onClick={() => {
            setActivatingConnector(walletlink);
            activate(walletlink);
          }}
        >
          <div className={styles.buttonContent}>
            {activatingConnector === walletlink ? (
              <>
                Connecting...
                <Spinner size="sm" animation="border" />
              </>
            ) : (
              <>
                WalletLink
                <img
                  src="assets/walletlink.png"
                  width={30}
                  height={30}
                  alt="logo metamask"
                />
              </>
            )}
          </div>
        </Button>
      </Col>
    );
  };

  return (
    <>
      <Col
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.button} onClick={() => setShowModal(true)} >
          <img src="/assets/button_on.png" alt="change character" />
          <p>Connect Wallet</p>
        </div>
      </Col>

      <Modal
        show={showModal}
        onHide={toggle}
        centered
        aria-labelledby="Wallet connection"
        animation={false}
      >
        <Modal.Body style={{ color: "black" }}>
          {!!error ? modalErrorContent(error) : modalContent()}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConnectWallet;
