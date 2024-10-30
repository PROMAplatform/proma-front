import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { H5, B4 } from "../../../styles/font-styles";
import {
    categoryColorsState,
    availableCategoriesState,
} from "../../../recoil/prompt/promptRecoilState";
import styles from "./CreateBlockModal.module.css";
import { usePromptHook } from "../../../api/prompt/prompt";
import ModalContainer from "../../common/ModalContainer";
import ModalButton from "../../common/ModalButton";
import { getLocalPromptMethod } from "../../../util/localStorage";
import { t } from "i18next";

const CreateBlockModal = ({ isOpen, onClose }) => {
    const categories = useRecoilValue(availableCategoriesState);
    const categoryColors = useRecoilValue(categoryColorsState);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [blockValue, setBlockValue] = useState("");
    const [blockDescription, setBlockDescription] = useState("");
    const { makeBlock, fetchBlocks } = usePromptHook();
    if (!isOpen) return null;

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const localPromptMethod = getLocalPromptMethod();

    const handleSubmit = async () => {
        await makeBlock(
            blockValue,
            blockDescription,
            selectedCategory,
            localPromptMethod,
        );
        fetchBlocks(localPromptMethod);
        setBlockValue("");
        setBlockDescription("");
        onClose();
    };

    return (
        <ModalContainer
            isOpen={isOpen}
            onClose={onClose}
            title={t(`promptMaking.newBlock`)}
            button={t(`promptMaking.blockMake`)}
            onSubmit={handleSubmit}
        >
            <div className={styles.formGroup}>
                <label htmlFor="category">
                    <H5>{t(`promptMaking.blockCategory`)}</H5>
                </label>
                <div className={styles.select}>
                    <ul className={styles.options}>
                        {categories.map((category) => (
                            <li
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                                className={styles.option}
                                style={{
                                    backgroundColor:
                                        category === selectedCategory
                                            ? categoryColors[category]
                                            : "var(--color-gray4)",
                                    transform:
                                        category === selectedCategory
                                            ? "Scale(1.1)"
                                            : "Scale(1)",
                                }}
                            >
                                <B4 color="white">{category}</B4>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="blockTitle">
                    <H5>{t(`promptMaking.blockTitle`)}</H5>
                </label>
                <input
                    id="blockTitle"
                    type="text"
                    value={blockValue}
                    onChange={(e) => setBlockValue(e.target.value)}
                    placeholder={t(`promptMaking.blockTitlePlaceHolder`)}
                    className={styles.input}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="blockDescription">
                    <H5>{t(`promptMaking.blockDescription`)}</H5>
                </label>
                <textarea
                    id="blockDescription"
                    value={blockDescription}
                    onChange={(e) => setBlockDescription(e.target.value)}
                    placeholder={t(`promptMaking.blockDescriptionPlaceHolder`)}
                    className={styles.blockDescription}
                    required
                />
            </div>
            <ModalButton
                title={t(`promptMaking.blockMake`)}
                variant="primary"
                type="submit"
            />
        </ModalContainer>
    );
};

export default CreateBlockModal;
