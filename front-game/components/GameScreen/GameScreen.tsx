import styles from "./GameScreen.module.scss";
import { Row, Col, Spinner, Toast } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { Contract, ethers } from "ethers";

import BlockchainService from "../../services/BlockchainService";
import DatabaseService from "../../services/DatabaseService";

import MapPlaceholder from "./MapPlaceholder";
import CharacterBox from "./CharacterBox";
import NftAvatar from "./NftAvatar";
import Map from "./Map";
import ActionBox from "./ActionBox";

import consts from "../../consts";

import { useCookies } from "react-cookie";

const { randomQuotes } = consts;

const GameScreen: FunctionComponent = (): JSX.Element => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tiles, setTiles] = useState<Array<any>>([]);
  const [character, setCharacter] = useState<any | null>(null);
  const [characterId, setCharacterId] = useState<number | null>(
    (cookies as any).characterId ? (cookies as any).characterId : null
  );
  const [spawned, setSpawned] = useState<Boolean>(false);
  const [spiceMined, setSpiceMined] = useState<number | null>(null);
  const [actions, setActions] = useState<number>(0);
  const [randomQuoteId, setRandomQuoteId] = useState<number>(0);
  const [originCoords, setOriginCoords] = useState<any>({
    x: 0,
    y: 0,
  });

  const [loading, setLoading] = useState<Boolean>(false);
  const [toastMessage, setToastMessage] = useState<String>("");
  const [totalSupply, setTotalSupply] = useState<number>(0);

  const [events, setEvents] = useState<any>([]);

  const DEFAULT_CHUNK_SIZE = process.env.DEFAULT_CHUNK_SIZE;
  const API_URL = process.env.API_URL;
  const WSS_URL = process.env.WSS_URL;
  const GAMEPLAY_CONTRACT_ADDRESS = process.env.GAMEPLAY_CONTRACT_ADDRESS;
  const APINATOR_CONTRACT_ADDRESS = process.env.APINATOR_CONTRACT_ADDRESS;

  const blockchainService = new BlockchainService(account);
  const databaseService = new DatabaseService();

  const provider = new ethers.providers.WebSocketProvider(WSS_URL as string);

  const gameplayContract = new ethers.Contract(
    GAMEPLAY_CONTRACT_ADDRESS as string,
    consts.gameplayABI,
    provider
  );

  const apinatorContract = new ethers.Contract(
    APINATOR_CONTRACT_ADDRESS as string,
    consts.apinatorABI,
    provider
  );

  useEffect(() => {
    (async () => {
      console.log("useEffect 2");
      gameplayContract.on(
        "moving",
        (tokenId, x, y, energy, xp, nextActionTime) => {
          let _events = [...events];
          console.log("copy", _events);
          _events.push({
            type: "MOVE",
            content: `#${tokenId} moved to (${x},${y}) !`,
          });
          setEvents(_events);
        }
      );

      gameplayContract.on(
        "mining",
        (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          let _events = [...events];
          console.log("copy", _events);
          _events.push({
            type: "MINE",
            content: `#${tokenId} mined $${_spiceAmount}  !`,
          });
          setEvents(_events);

          setLoading(true);
        }
      );

      gameplayContract.on(
        "resting",
        (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          let _events = [...events];
          _events.push({
            type: "REST",
            content: `#${tokenId} is taking a nap  !`,
          });
          setEvents(_events);
          setLoading(true);
        }
      );

      gameplayContract.on(
        "spawned",
        (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          let _events = [...events];
          _events.push({
            type: "SPAWNED",
            content: `#${tokenId} spawned on the map. Welcome !`,
          });
          setEvents(_events);
          setLoading(true);
        }
      );

      gameplayContract.on(
        "spawned",
        (tokenId, _bank, _spiceAmount, _xp, _nextActionTime) => {
          let _events = [...events];
          _events.push({
            type: "SPAWNED",
            content: `#${tokenId} left us. RIP !`,
          });
          setEvents(_events);
          setLoading(true);
        }
      );

      gameplayContract.on(
        "leveledUp",
        (_tokenId, _mining, _hpMax, _energyMax) => {
          let _events = [...events];
          _events.push({
            type: "LEVELUP",
            content: `#${_tokenId} has leveled up. Fear him !`,
          });
          setEvents(_events);
          setLoading(true);
        }
      );

      apinatorContract.on("Transfer", (from, to, tokenId) => {
        console.log("[EVENT] transfer");
        console.log("tokenId", tokenId);

        let _events = [...events];
        _events.push({
          type: "MINT",
          content: `#${tokenId} transfered ${to}   !`,
        });
        setEvents(_events);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!randomQuoteId)
        setRandomQuoteId(Math.floor(randomQuotes.length * Math.random()));

      if (!library) return;

      //setUserBalance(await library.eth.getBalance(account));

      setTotalSupply(await await blockchainService.totalSupply());

      const _character: any =
        characterId === null
          ? {}
          : await blockchainService.getCharacterInfo(characterId);

      let _tiles = await blockchainService.getMapChunk(
        originCoords.x,
        originCoords.y,
        parseInt(DEFAULT_CHUNK_SIZE as string)
      );

      //with API
      // await axios.get(
      //   API_URL +
      //     `/map?x=${originCoords.x}=&y=${originCoords.y}&range=${DEFAULT_CHUNK_SIZE}`
      // );
      //_tiles = _tiles.data.result

      setTiles(_tiles);

      //load charater info
      if (tiles && _character && Number.isInteger(_character.x)) {
        setCharacter(_character);
        setSpiceMined(await blockchainService.getSpiceMined(characterId));
      }

      setLoading(false);
    })();
  }, [library, actions, originCoords, characterId, toastMessage, events]);

  const selectNft = async (e: any) => {
    // @ts-ignore: Object is possibly 'null'.
    let element = document ? document!.getElementById("nftId").value : null;
    let nftId = element !== null ? parseInt(element) : 0;

    let owner = await blockchainService.ownerOf(nftId as number);

    if (owner === account) {
      setCookie("characterId" as "cookie-name", nftId, { path: "/" });
      setCharacterId(nftId);
      setLoading(true);
    } else setToastMessage("This NFT doesn't belong to you come on.");
    return;
  };

  const mintNft = async (e: any) => {
    await blockchainService.mintNft(1, library);
    return;
  };

  //render
  console.log("Gamescreen loading", events);
  return (
    <>
      <div className={styles.canvas}>
        <Toast
          show={toastMessage && toastMessage.length > 0}
          className={styles.toast}
          onClose={() => setToastMessage("")}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Info</strong>
            <small> </small>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>

        <Row>
          <span className={styles.quotes}>{randomQuotes[randomQuoteId]}</span>
        </Row>

        <Row>
          <Col xs={5}></Col>
          <Col xs={3}>
            <Row>
              <label>Choose NFT character.</label>
              <input
                type="number"
                placeholder="nftId"
                id="nftId"
                defaultValue={characterId?.toString()}
              ></input>
              <button onClick={selectNft} className={styles.pushable}>
                <span className={styles.front}>select ID</span>
              </button>
              <div>or</div>
              <button onClick={mintNft} className={styles.pushable}>
                <span className={styles.front}> mint 1</span>
              </button>
              <br />{" "}
            </Row>
          </Col>
        </Row>

        {loading && (
          <Row>
            <Col xs={5}></Col>
            <Col xs={1}>
              <Spinner animation="grow" />
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={8}>
            {character && (
              <Row>
                <Col xs={3}>
                  <NftAvatar />
                </Col>
                <Col>
                  {character ? (
                    <CharacterBox
                      character={character}
                      spiceMined={spiceMined}
                      characterId={characterId}
                    />
                  ) : (
                    <img src={"/robot.gif"} className={styles.loadingGif} />
                  )}
                </Col>
              </Row>
            )}
          </Col>

          <Col>
            <Row>
              <div>{totalSupply} player(s)</div>
            </Row>
            <Row>
              {events.map((event: any) => {
                return (
                  <div className={styles.events}>
                    [{event.type}] {event.content}
                  </div>
                );
              })}
            </Row>
          </Col>
        </Row>

        <Row>
          <Col>
            {tiles && tiles.length ? (
              <Map
                tiles={tiles}
                character={character}
                setOriginCoords={setOriginCoords}
                originCoords={originCoords}
                setLoading={setLoading}
              />
            ) : (
              <MapPlaceholder length={parseInt(DEFAULT_CHUNK_SIZE as string)} />
            )}
          </Col>
          {character && (
            <Col xs={4}>
              <ActionBox
                character={character}
                actions={actions}
                setActions={setActions}
                characterId={characterId}
                setLoading={setLoading}
              />
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default GameScreen;
