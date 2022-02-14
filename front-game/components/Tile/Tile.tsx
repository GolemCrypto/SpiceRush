import styles from "./Tile.module.scss";
import { Container, Row } from "react-bootstrap";
import { useState, FunctionComponent, useEffect } from "react";

const Header: FunctionComponent = (): JSX.Element => {
  return (
    <>
      <div className={styles.tile}></div>
    </>
  );
};

export default Header;
