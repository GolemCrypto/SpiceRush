import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Presentation from "../components/Presentation/Presentation";
import Section from "../components/Section/Section";
import textSection from "../components/textSection";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
/* import Scene from "../components/Scene/Scene"; */
/* import RoadmapV2 from "../components/RoadmapV2/RoadmapV2"; */
import VideoSection from "../components/VideoSection/VideoSection";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";

import dynamic from "next/dynamic";

const Roadmap = dynamic(() => import("../components/Roadmap/Roadmap"), {
  ssr: false,
});

const RoadmapDesktop = dynamic(
  () => import("../components/RoadmapDesktop/RoadmapDesktop"),
  { ssr: false }
);

const Home: NextPage = () => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const animation = useAnimation();

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    if (inView) {
      animation.start({
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 2,
          bounce: 0.3,
        },
      });
    } else {
      animation.start({ y: "20%", opacity: 0 });
    }
  }, [inView]);

  const VideoComponent: JSX.Element = useMemo(() => {
    return <Presentation isMobile={isMobile} />;
  }, [isMobile]);

  return (
    <div className={styles.container}>
      {
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            zIndex: 10,
          }}
        >
          <Header isMobile={isMobile} />
        </header>
      }

      {VideoComponent}

      <div className={styles.sectionFooter}>
        <div className={styles.rectangle1}></div>
        <img
          className={styles.image}
          src="./pictures/HexagonLogo.svg"
          alt="testLogo"
        />
        <div className={styles.rectangle2}></div>
      </div>

      <section ref={ref}>
        <motion.div
          style={{ marginBottom: !isMobile ? "6vh" : "0" }}
          animate={animation}
        >
          <Section
            inverse={true}
            isMobile={isMobile}
            Image="./pictures/iso_city_2.png"
            Title={<h1>{textSection.section1.title}</h1>}
            Text={
              <>
                <br></br>
                <p>{textSection.section1.part1}</p>
                <br></br>
                <p>{textSection.section1.part2}</p>
                <br></br>

                <a
                  href="https://golemdao.gitbook.io/spicerush/ecosystem/dao"
                  target="_blank"
                >
                  <Button className={styles.button}>more</Button>
                </a>
              </>
            }
          />
        </motion.div>
        <div style={{ height: !isMobile ? "130vh" : "155vh" }}>
          <VideoSection isMobile={isMobile} />
        </div>
        <motion.div
          style={{
            marginTop: "6vh",
          }}
          animate={animation}
        >
          <Section
            inverse={true}
            isMobile={isMobile}
            Image="../pictures/ApeWithStats.png"
            /*  Image = "../pictures/test.svg" */
            Title={<h1>{textSection.section3.title}</h1>}
            Text={
              <>
                <br></br>
                <p>{textSection.section3.part1}</p>
                <br></br>
                <p>{textSection.section3.part2}</p>
                <br></br>
                <p>{textSection.section3.part3}</p>
                <br></br>
                <a
                  href="https://golemdao.gitbook.io/spicerush/gameplay/spice"
                  target="_blank"
                >
                  <Button className={styles.button}>more</Button>
                </a>
              </>
            }
          />
        </motion.div>

        <div>
          {typeof window !== "undefined" && isMobile && <Roadmap />}
          {typeof window !== "undefined" && !isMobile && <RoadmapDesktop />}
        </div>
      </section>

      <div className={styles.hexagons}></div>
      <div className={styles.footer}>
        <Footer isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Home;
