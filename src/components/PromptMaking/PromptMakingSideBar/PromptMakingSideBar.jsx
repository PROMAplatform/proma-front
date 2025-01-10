import React, {useEffect} from "react";
import styles from "./PromptMakingSidebar.module.css";
import { H4 } from "../../../styles/font-styles";
import logo from "../../../assets/logos/promaLogoSmall.svg";
import { Link } from "react-router-dom";
import AiBlockSection from "./components/AiBlockSection";
import BlockSection from "./components/BlockSection";
import {useRecoilState, useSetRecoilState} from "recoil";
import {userHistoryState} from "../../../recoil/prompt/promptRecoilState";

const PromptMakingSidebar = () => {
    const setUserHistory = useSetRecoilState(userHistoryState);

    //userhistory 초기화
    useEffect(() => {
        setUserHistory({});
    }, []);

    return (
        <div className={styles.container}>
            <Link to="/main">
                <img
                    alt="sideBar 헤더 로고"
                    src={logo}
                    className={styles.promaLogo}
                />
            </Link>

            <div className={styles.promptTitle}>
                <H4>PROMA prompt</H4>
            </div>
            <div className={styles.sidebar}>
                <BlockSection />
            </div>

            <div className={styles.promptTitle}>
                <H4>AI recommend</H4>
            </div>
            <div className={styles.sidebar}>
                <AiBlockSection />
            </div>
        </div>
    );
};

export default PromptMakingSidebar;
