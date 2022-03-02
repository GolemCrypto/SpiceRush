import { useState, FunctionComponent } from "react";
import {
  Nav,
  Navbar,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import styles from "./Header.module.scss";
interface Props {
  currentElementIndexInViewport?: number;
}

const Header: FunctionComponent<Props> = ({
  currentElementIndexInViewport: index,
}): JSX.Element => {
  const [clickDiscord, setClickDiscord] = useState<boolean>(false);
  const [clickTiktok, setClickTiktok] = useState<boolean>(false);

  return (
    <Navbar
      expand="xl"
      fixed="top"
      className="p-0"
      variant="dark"
      collapseOnSelect
      style={{ width: "100vw" }}
    >
      <Container className={styles.navContainer}>
        <Nav.Link className={styles.brand} href="/#topSection">
          <h1>
            <img
              src="/pictures/golem_logo.png"
              alt="Apinator"
              style={{ maxWidth: "5em" }}
            />
          </h1>
        </Nav.Link>
        <Navbar.Toggle aria-controls="navbar" style={{ border: "none" }}>
          <img
            alt="menu burger"
            width="30"
            height="30"
            src="/pictures/burger.png"
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar" className=" justify-content-between">
          <Nav className={styles.navBar}>
            <Nav.Link href="/#topSection">
              <span>
                <a
                  href="https://metapolis.gitbook.io/apinator-2042-v1/"
                  target="_blank"
                >
                  Whitepaper
                </a>
              </span>
            </Nav.Link>

            <Nav.Link href="/#topSection">
              <span>Token</span>
            </Nav.Link>
            <Nav.Link href="/#mintSection">
              <span>Staking</span>
            </Nav.Link>

            <Nav.Link href="/#NFT">
              <span>Buy land</span>
            </Nav.Link>

            <Nav.Link href="/#NFT">
              <span>Buy NFT</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
