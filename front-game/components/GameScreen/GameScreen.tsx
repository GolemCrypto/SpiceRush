import styles from "./GameScreen.module.scss";
import { Row, Col, Spinner } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

import { useWeb3React } from "@web3-react/core";

import BlockchainService from "../../services/BlockchainService";

import MapPlaceholder from "./MapPlaceholder";
import CharacterBox from "./CharacterBox";
import NftAvatar from "./NftAvatar";
import Map from "./Map";
import ActionBox from "./ActionBox";

import consts from "../../consts";
const { randomQuotes } = consts;

const GameScreen: FunctionComponent = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tiles, setTiles] = useState<Array<any>>([]);
  const [character, setCharacter] = useState<Object | null>(null);
  const [spiceMined, setSpiceMined] = useState<number | null>(null);
  const [actions, setActions] = useState<number>(0);
  const [randomQuoteId, setRandomQuoteId] = useState<number>(0);
  const [originCoords, setOriginCoords] = useState<Object>({
    x: null,
    y: null,
  });
  const [loading, setLoading] = useState<Boolean>(false);

  const mapSize = 5;
  const blockchainService = new BlockchainService(account);

  useEffect(() => {
    (async () => {
      console.log("useEffect Gamescreen");

      if (!randomQuoteId)
        setRandomQuoteId(Math.floor(randomQuotes.length * Math.random()));

      if (!library) return;

      setUserBalance(await library.eth.getBalance(account));
      const _character = await blockchainService.getCharacterInfo(0);
      setCharacter(_character);

      setSpiceMined(await blockchainService.getSpiceMined(0));

      //center map around character or (0,0) at first
      let x0 = originCoords.x;
      let y0 = originCoords.y;
      if (y0 === null || x0 === null) {
        if (_character) {
          x0 = _character.x;
          y0 = _character.y;
        } else {
          x0 = 0;
          y0 = 0;
        }
        setOriginCoords({ x: x0, y: y0 });
      }

      let tiles;
      tiles = await blockchainService.getMapChunk(x0, y0, mapSize);

      setTiles(tiles);
      setLoading(false);
    })();
  }, [library, actions, originCoords]);

  //render
  console.log("Gamescreen loading", loading);
  return (
    <>
      <div className={styles.canvas}>
        <Row>
          <span className={styles.quotes}>{randomQuotes[randomQuoteId]}</span>
        </Row>
        <Row>
          <Col xs={8}>
            <Row>
              <Col xs={3}>
                <NftAvatar />
              </Col>
              <Col>
                {character ? (
                  <CharacterBox character={character} spiceMined={spiceMined} />
                ) : (
                  <img src={"/robot.gif"} className={styles.loadingGif} />
                )}
              </Col>
              {loading && (
                <Col xs={1}>
                  <Spinner animation="grow" />
                </Col>
              )}
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
              <MapPlaceholder length={mapSize} />
            )}
          </Col>
          <Col xs={4}>
            <ActionBox
              character={character}
              actions={actions}
              setActions={setActions}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GameScreen;
