import styles from "../Minter/Minter.module.scss";
import { useEffect, useState, FunctionComponent, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Button,
  Table,
  Dropdown,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import CardBody from "../Card/Card";
import contractABI from "../../WalletHelpers/contractAbi.json";
import {
  contractAddress,
  provider,
} from "../../WalletHelpers/contractVariables";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Props {
  referralCode?: any;
  secretCode?: any;
  isMobile: boolean;
}

const Minter: FunctionComponent<Props> = (props): JSX.Element => {
  const { referralCode, secretCode, isMobile } = props;
  const { account, library, chainId } = useWeb3React();
  const [nftQuantity, setNftQuantity] = useState<number>(1);
  const [nftPrice, setNftPrice] = useState<number>(0.25);
  const [userCode, setUserCode] = useState<any>("");
  const [writtenCode, setWrittenCode] = useState<any>("");
  const [totalReferred, setTotalReferred] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const maxTransaction: number = 5;
  const alch = createAlchemyWeb3(provider);
  const referralCard = useRef(null);

  const contract = new library.eth.Contract(
    contractABI as any,
    contractAddress
  );

  useEffect(() => {
    (async () => {
      if (!!account && !!library) {
        setIsActive(await contract.methods.isActive().call());
        setTotalReferred(await contract.methods.totalReferred(account).call());
        setTotalRewards(await contract.methods.bank(account).call());
        setUserCode(await contract.methods.ReferralToCode(account).call());
        setNftPrice(await contract.methods.NFTPrice().call());
      }
    })();
  }, [account, library]);

  async function switchPolygon(type: any) {
    if (typeof library !== "undefined") {
      let network: any = 0;
      network = chainId;
      let netID = network.toString();
      let params;
      if (netID !== "137") {
        params = [
          {
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com/"],
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ];
      }

      window.ethereum
        .request({ method: "wallet_addEthereumChain", params })
        .then(() => console.log("Success"))
        .catch((error: any) => console.log("Error", error.message));
    } else {
      alert("Unable to locate a compatible web3 browser!");
    }
  }

  const toggle = () => setShowModal(!showModal);

  const modalContent = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <p>
          The Free mint supply has already been dispatched... But you can still
          get the exclusive mint!
        </p>
        <p>Click the button below to join the alpha!</p>
        <a href="https://www.spicerush.io/mint/">
          <Button
            style={{
              backgroundColor: "#ea00d9",
              border: "none",
              padding: "20px",
              width: "150px",
            }}
          >
            ACCESS MINT
          </Button>
        </a>
      </div>
    );
  };

  const handleScroll = (ref: any) => {
    console.log(ref.offsetTop);
    window.scrollTo({
      top: ref.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const getPriorityGasPrice = async () => {
    let res = await alch.eth.getMaxPriorityFeePerGas();
    return res;
  };

  const hasFunds = async (nftsPrice: number) => {
    return nftsPrice <= (await library.eth.getBalance(account));
  };

  const handleMint = () => {
    if (!!secretCode) {
      mintFreeNFT(secretCode, nftQuantity);
    } else {
      if (!!referralCode) {
        mintNFTwithReferral(nftQuantity, referralCode);
      } else if (!!writtenCode) {
        mintNFTwithReferral(nftQuantity, writtenCode);
      } else {
        mintNFTwithoutReferral(nftQuantity);
      }
    }
  };

  const mintNFTwithReferral = async (amount: number, referralCode: string) => {
    if (!!account && !!library) {
      if (!(await contract.methods.isActive().call())) {
        alert("Sale has not started");
        return;
      }

      const NFTminted = await contract.methods.mintedAmount(account).call();
      const NftMaxPerAccount = await contract.methods.maxMint().call();

      if (Number(NFTminted) + Number(amount) > Number(NftMaxPerAccount)) {
        alert("You already minted your NFT!");
        return;
      }

      /*   if (amount > maxTransaction) {
        alert("Max 5 NFT per transaction");
        return;
      } */

      const nftsValue = amount * nftPrice;

      if (!(await hasFunds(nftsValue))) {
        alert("Insufficient funds");
        return;
      }

      const codeToReferral = await contract.methods
        .codeToReferral(referralCode)
        .call();

      if (codeToReferral == 0) {
        alert("referral code is not valid!");
        return;
      }

      const priority = Number(await getPriorityGasPrice()) / 1000000000;

      const transactionParameters = {
        from: account,
        value: await nftsValue.toString(),
        maxPriorityFeePerGas: library.utils.toWei(priority.toString(), "gwei"),
      };

      contract.methods
        .mintNFT(amount, referralCode)
        .send(transactionParameters)
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {
          handleScroll(referralCard.current);
        })
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

  const mintFreeNFT = async (secretCode: any, amount: number) => {
    if (!!account && !!library) {
      if (!(await contract.methods.isActive().call())) {
        alert("Sale has not started");
        return;
      }

      const NFTminted = await contract.methods.mintedAmount(account).call();
      const NftMaxPerAccount = await contract.methods.maxMint().call();

      if (Number(NFTminted) + 1 > Number(NftMaxPerAccount)) {
        alert("You already minted your NFT!");
        return;
      }

      const secretHash = library.utils.soliditySha3(secretCode);
      const secretToAmountFreeMint = await contract.methods
        .secretToAmountFreeMint(secretHash)
        .call();
      const secretToMaxAmountFreeMint = await contract.methods
        .secretToMaxAmountFreeMint(secretHash)
        .call();

      if (
        Number(amount) + Number(secretToAmountFreeMint) >
        Number(secretToMaxAmountFreeMint)
      ) {
        setShowModal(true);
        return;
      }

      const priority = Number(await getPriorityGasPrice()) / 1000000000;

      const transactionParameters = {
        from: account,
        maxPriorityFeePerGas: library.utils.toWei(priority.toString(), "gwei"),
      };

      contract.methods
        .mintNFTFree(secretCode, amount)
        .send(transactionParameters)
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {
          handleScroll(referralCard.current);
        })
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

  const mintNFTwithoutReferral = async (amount: number) => {
    if (!!account && !!library) {
      if (!(await contract.methods.isActive().call())) {
        alert("Sale has not started");
        return;
      }

      const NFTminted = await contract.methods.mintedAmount(account).call();
      const NftMaxPerAccount = await contract.methods.maxMint().call();

      if (Number(NFTminted) + Number(amount) > Number(NftMaxPerAccount)) {
        alert("You already minted your NFT!");
        return;
      }

      /*  if (amount > maxTransaction) {
        alert("Max 5 NFT per transaction");
        return;
      } */

      const nftsValue = amount * nftPrice;

      if (!(await hasFunds(nftsValue))) {
        alert("Insufficient funds");
        return;
      }

      const priority = Number(await getPriorityGasPrice()) / 1000000000;

      const transactionParameters = {
        from: account,
        value: await nftsValue.toString(),
        maxPriorityFeePerGas: library.utils.toWei(priority.toString(), "gwei"),
      };

      contract.methods
        .mintNFT(amount)
        .send(transactionParameters)
        .on("transactionHash", function (hash: any) {})
        .on("receipt", function (receipt: any) {
          handleScroll(referralCard.current);
        })
        .on("error", function (error: any, receipt: any) {
          console.log(error);
        });
    }
  };

  if (chainId !== 137) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center" }}>
          This website is only compatible with the polygon mainnet network.{" "}
        </p>
        {!isMobile && (
          <>
            <p>Please switch using the button below:</p>

            <div className={styles.buttonContainer}>
              <Button
                className={styles.button1}
                onClick={() => switchPolygon(library)}
              >
                Switch network
              </Button>

              <div className={styles.rectangle1}></div>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <>
        <div className={styles.container}>
          {!!account && library && (
            <>
              <div>
                <div style={{ textAlign: "center" }}>
                  {secretCode ? (
                    <p>Get exclusive early access to Alpha-Mainnet for free.</p>
                  ) : (
                    <p>Get exclusive early access to Alpha-Mainnet.</p>
                  )}
                </div>
                <Table className={styles.table}>
                  <tbody>
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        <strong>APEx7</strong> Microchips
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        {/*  <img src="/pictures/microchip_side_1.png" alt="chip" /> */}
                        <img src="/pictures/microchip.gif" alt="chip" />
                      </td>
                    </tr>
                    {!secretCode && (
                      <tr>
                        <td colSpan={2}>Referral Code*</td>
                        <td className={styles.inputTD}>
                          {!referralCode && (
                            <InputGroup className={styles.inputGroup}>
                              <FormControl
                                type="number"
                                placeholder="referral code"
                                aria-label="referral code"
                                aria-describedby="basic-addon1"
                                className={styles.referral}
                                value={referralCode}
                                onChange={(e) => setWrittenCode(e.target.value)}
                              />
                            </InputGroup>
                          )}
                          {referralCode && referralCode}
                        </td>
                      </tr>
                    )}
                    {/* <tr>
                    <td>Amount</td>
                    <td style={{ color: "transparent" }}>FOUND</td>
                    <td style={{ textAlign: "right" }}>
                      <Dropdown>
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className={styles.dropdown}
                        >
                          {nftQuantity}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setNftQuantity(1)}>
                            1
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(2)}>
                            2
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(3)}>
                            3
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(4)}>
                            4
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setNftQuantity(5)}>
                            5
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr> */}

                    <tr>
                      <td style={{ width: "50%" }}>Price</td>
                      <td
                        colSpan={!isMobile ? 3 : 2}
                        style={{
                          textAlign: "right",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        {!secretCode
                          ? `${
                              (nftPrice * nftQuantity) / 1000000000000000000
                            } MATIC`
                          : `0 MATIC`}
                      </td>
                    </tr>

                    {!!!secretCode && (
                      <em
                        style={{
                          color: "red",
                          fontSize: "13px",
                        }}
                      >
                        *Valid code gets 5 claimable MATIC
                      </em>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className={styles.buttonContainer}>
                <Button
                  style={{ fontWeight: "bold", fontSize: "28px" }}
                  className={styles.button1}
                  onClick={() => handleMint()}
                >
                  MINT
                </Button>

                <div className={styles.rectangle1}></div>
              </div>

              {userCode !== undefined && userCode !== "0" && (
                <div
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  ref={referralCard}
                >
                  <CardBody
                    header={
                      <Row className="d-flex flex-row">
                        <h1> REFERRALS CASHBACK</h1>
                      </Row>
                    }
                    subtitle={
                      <Row className="d-flex flex-row">
                        <span style={{ color: "red", fontSize: "20px" }}>
                          You now have your own referral code to share and get 5
                          MATIC reward for each mint!
                        </span>
                      </Row>
                    }
                    textTitle1={
                      <>
                        <h2>{totalRewards / 1000000000000000000} MATIC</h2>
                        <p>available cashback</p>
                      </>
                    }
                    textTitle2={
                      <>
                        {userCode == 0 ? (
                          "-"
                        ) : (
                          <h2
                            onClick={() =>
                              navigator.clipboard.writeText(`${userCode}`)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {userCode}
                          </h2>
                        )}
                        <p>your referral code</p>
                      </>
                    }
                    textSubtitle2={<p>your referral link (click to copy): </p>}
                    buttonTitle1="CLAIM"
                    buttonTitle2="SHARE"
                    footer={
                      <p>
                        You referred{" "}
                        <span style={{ fontSize: "30px" }}>
                          {totalReferred}
                        </span>{" "}
                        mints
                      </p>
                    }
                    userCode={userCode}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <Modal
          show={showModal}
          onHide={toggle}
          centered
          aria-labelledby="Wallet connection"
          animation={false}
        >
          <Modal.Body
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              backgroundColor: "black",
              height: "40vh",
            }}
          >
            {modalContent()}
          </Modal.Body>
        </Modal>
      </>
    );
  }
};

export default Minter;
