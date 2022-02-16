import styles from "./Map.module.scss";
import { Container, Row, Col } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";
import Tile from "../Tile/Tile";
import CharacterBox from "../CharacterBox/CharacterBox";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import BlockchainService from "../../services/BlockchainService";

import consts from "../../consts";

const Map: FunctionComponent = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tiles, setTiles] = useState<Array<any>>([]);
  const [character, setCharacter] = useState<Object | null>(null);
  let x0 = 0;
  let y0 = 0;

  const blockchainService = new BlockchainService(account, "0x");

  useEffect(() => {
    (async () => {
      if (!library) return;
      console.log("library_", library);

      setUserBalance(await library.eth.getBalance(account));
      // console.log(" balance ", await blockchainService.getBalance());
      // //console.log(" getTileInfo ", blockchainService.getTileInfo());
      // console.log("owner of", await blockchainService.ownerOf());

      console.log("character", await blockchainService.getCharacterInfo(0));
      setCharacter(await blockchainService.getCharacterInfo(0));
      setTiles(await blockchainService.getMapChunk(0, 0, 6));
    })();
  }, [library]);

  //////build tile
  let row_tiles = [];
  for (let i = 0; i < tiles.length; i++) {
    row_tiles.push(<Tile />);
  }

  let tiles_html = tiles.map((row) => {
    return (
      <div>
        {row.map(function (tile: any) {
          const currentPosition =
            character.x === tile.x && character.y === tile.y;

          return <Tile level={tile.level} currentPosition={currentPosition} />;
        })}
      </div>
    );
  });

  //render
  return (
    <>
      <div className={styles.canvas}>
        <h3>ApezorDu45</h3>

        <Row>
          <Col xs={8}>
            {" "}
            {character && <CharacterBox character={character} />}
            <div className={styles.map}>{tiles_html}</div>
          </Col>
          <Col xs={4}>
            {" "}
            <div>
              <img src="/ape_rust.jpeg" style={{ maxWidth: "100px" }} />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Map;
