import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Presentation from "../components/Presentation/Presentation";
import Section from "../components/Section/Section";
import textSection from "../components/textSection";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Scene from "../components/Scene/Scene";
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
  const [isActive1, setIsActive1] = useState<boolean>(false);
  const [isActive2, setIsActive2] = useState<boolean>(false);
  const [isActive3, setIsActive3] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const animation = useAnimation();

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  useEffect(() => {
    if (inView) {
      console.log("use effect hook, inView =", inView);
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

  const video = useMemo(() => {
    return <Presentation isMobile={isMobile} />;
  }, [isMobile]);
  const scene = useMemo(() => {
    return <Scene isMobile={isMobile} />;
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
      <div className={styles.presentation}>{video}</div>

      <div className={styles.sectionFooter}>
        <div className={styles.rectangle1}></div>
        <img
          className={styles.image}
          src="./pictures/testLogo.png"
          alt="testLogo"
        />
        <div className={styles.rectangle2}></div>
      </div>

      <section ref={ref}>
        <motion.div style={{ marginBottom: "6vh" }} animate={animation}>
          <Section
            inverse={true}
            isMobile={isMobile}
            Image="./pictures/iso_city_2.png"
            Text={
              <>
                <h1>{textSection.section1.title}</h1>
                <br></br>
                <p>{textSection.section1.part1}</p>
                <br></br>
                <p>{textSection.section1.part2}</p>
                <br></br>

                <a
                  href="https://golemdao.gitbook.io/apinator-2042-by-golem/ecosystem/dao"
                  target="_blank"
                >
                  <Button className={styles.button}>more</Button>
                </a>
                {/*   {isActive1 && <h1>SOON</h1>} */}
              </>
            }
          />
        </motion.div>
        <div className={styles.scene}>{scene}</div>
        <motion.div
          style={{ marginTop: "6vh", marginBottom: "6vh" }}
          animate={animation}
        >
          <Section
            inverse={false}
            isMobile={isMobile}
            Image="../pictures/lands.gif"
            Text={
              <>
                <h1>{textSection.section2.title}</h1>
                <br></br>
                <p>{textSection.section2.part1}</p>
                <br></br>
                <p>{textSection.section2.part2}</p>
                <br></br>
                <p>{textSection.section2.part3}</p>
                <br></br>
                <a
                  href="https://golemdao.gitbook.io/apinator-2042-by-golem/ecosystem/staking#land-autostaking"
                  target="_blank"
                >
                  <Button className={styles.button}>more</Button>
                </a>
                {/* {isActive2 && <h1>SOON</h1>} */}
              </>
            }
          />
        </motion.div>
        <motion.div
          style={{ marginTop: "6vh", marginBottom: "6vh" }}
          animate={animation}
        >
          <Section
            inverse={true}
            isMobile={isMobile}
            Image="../pictures/ape_card_stats_uncovered.gif"
            Text={
              <>
                <h1>{textSection.section3.title}</h1>
                <br></br>
                <p>{textSection.section3.part1}</p>
                <br></br>
                <p>{textSection.section3.part2}</p>
                <br></br>
                <p>{textSection.section3.part3}</p>
                <br></br>
                <a
                  href="https://golemdao.gitbook.io/apinator-2042-by-golem/gameplay/spice"
                  target="_blank"
                >
                  <Button
                    className={
                      styles.button
                    } /* onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)} 
                onClick={() => setIsActive3(true)}*/
                  >
                    more
                  </Button>
                </a>
                {/*  {isActive3 && <h1>SOON</h1>} */}
              </>
            }
          />
        </motion.div>
      </section>
      <div style={{ marginTop: "5vh" }}>
        {typeof window !== "undefined" && isMobile && <Roadmap />}
        {typeof window !== "undefined" && !isMobile && <RoadmapDesktop />}
      </div>

      <div className={styles.hexagons}>
        {/* <img src="../pictures/hexagonals.svg" /> */}
      </div>
      <div className={styles.footer}>
        <Footer isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Home;
