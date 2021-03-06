import { useEffect, useState, FunctionComponent, ReactNode } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Section.module.scss";

interface Props {
  Image?: string;
  Text: ReactNode;
  Title: ReactNode;
  Button?: ReactNode;
  inverse: boolean;
  isMobile: boolean;
}

const Section: FunctionComponent<Props> = (props): JSX.Element => {
  let style: any;
  if (props.isMobile) {
    style = "column";
  } else {
    style = props.inverse ? "row-reverse" : "row";
  }

  return (
    <div className={styles.container}>
      <Row className={styles.contentContainer} style={{ flexDirection: style }}>
        {!props.isMobile ? (
          <>
            <div
              style={{
                width: "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={props.Image} />
            </div>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              {props.Title}
              {props.Text}
            </div>
          </>
        ) : (
          <>
            <div className="justify-content-center">
              {props.Title}
              <br></br>
              <img src={props.Image} />
            </div>
            <div style={{ textAlign: "left" }}>{props.Text}</div>
          </>
        )}
      </Row>
    </div>
  );
};

export default Section;
