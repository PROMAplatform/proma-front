import React, { useState } from "react";
import styles from "./CreatePromptModal.module.css";
import ModalContainer from "../../../../common/ModalContainer";
import ModalButton from "../../../../common/ModalButton";
import PromptMethodButton from "../PromptMethodButton";
import characterIcon from "../../../../../assets/images/characterIcon.svg";
import taskIcon from "../../../../../assets/images/taskIcon.svg";
import freeIcon from "../../../../../assets/images/freeIcon.svg";
import { useNavigate } from "react-router-dom";
import {useRecoilState} from "recoil";
import { promptMethodState } from "../../../../../recoil/prompt/promptRecoilState";
import {setLocalPromptCategory, setLocalPromptMethod} from "../../../../../util/localStorage";
import {B5, H5} from "../../../../../styles/font-styles";
import { t } from "i18next";

function CreatePromptModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [promptMethod, setPromptMethod] = useRecoilState(promptMethodState);

    const allCategories = ["IT", "게임", "글쓰기", "건강", "교육", "예술", "기타"];
    const [promptCategory, setPromptCategory] = useState("IT");


    if (!isOpen) return null;

    const handleCreateClick = () => {
        if (promptMethod) {
            setLocalPromptCategory(promptCategory);
            setLocalPromptMethod(promptMethod);
            navigate(`/promptMaking/`);
            onClose();
        }
    };

    const handleMethodClick = (method) => {
        setPromptMethod(method);
    };

    return (
        <ModalContainer
            isOpen={isOpen}
            onClose={onClose}
            title={t(`sideBar.addNewPrompt`)}
            onSubmit={handleCreateClick}
        >
            <div className={styles.container}>
                <H5>{t(`sideBar.choosePromptType`)}</H5>
                <div className={styles.typeContainer}>
                    <PromptMethodButton
                        type="Character"
                        icon={characterIcon}
                        isSelected={promptMethod === "Character"}
                        onClick={() => handleMethodClick("Character")}
                    />
                    <PromptMethodButton
                        type="Task/Research"
                        icon={taskIcon}
                        isSelected={promptMethod === "Task/Research"}
                        onClick={() => handleMethodClick("Task/Research")}
                    />
                    <PromptMethodButton
                        type="Free"
                        icon={freeIcon}
                        isSelected={promptMethod === "Free"}
                        onClick={() => handleMethodClick("Free")}
                    />
                </div>
            </div>
            <div>
                카테고리
                <div className={styles.select}>
                    <ul className={styles.options}>
                        {allCategories.map((category) => (
                            <li
                                key={category}
                                onClick={(e) => setPromptCategory(category)}
                                className={`${styles.option} ${
                                    category === promptCategory
                                        ? styles.active
                                        : styles.none
                                }`}
                            >
                                <B5
                                    color={
                                        category === promptCategory
                                            ? "white"
                                            : "gray5"
                                    }
                                >
                                    {category}
                                </B5>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <ModalButton
                title={t(`sideBar.endChoose`)}
                variant="primary"
                size="medium"
                onClick={handleCreateClick}
            />
        </ModalContainer>
    );
}

export default CreatePromptModal;
