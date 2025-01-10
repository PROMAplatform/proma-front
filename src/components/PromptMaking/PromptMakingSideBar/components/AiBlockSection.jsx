import React, { useEffect } from "react";
import styles from "./AiBlockSection.module.css";
import { B4, B5 } from "../../../../styles/font-styles";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PromptValueBlock from "../../../common/Prompt/PromptValueBlock";
import { t } from "i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    activeAiBlocksState,
    activeCategoryState,
    availableCategoriesState,
    blockDetailsState,
    categoryBlockShapesState,
    categoryColorsState,
    fetchAiBlocksState,
} from "../../../../recoil/prompt/promptRecoilState";
import {
    getLocalPromptCategory,
    getLocalPromptMethod,
} from "../../../../util/localStorage";
import { usePromptHook } from "../../../../api/prompt/prompt";
import promaAnimation from "../../../../assets/animation/promaAnimation.json";
import Lottie from "react-lottie";

function AiBlockSection() {
    const categoryColors = useRecoilValue(categoryColorsState);
    const categoryBlockShapes = useRecoilValue(categoryBlockShapesState);
    const localPromptMethod = getLocalPromptMethod();
    const localPromptCategory = getLocalPromptCategory();
    const { fetchAiBlocks } = usePromptHook();
    const [isLoading, setFetchAiBlocksState] =
        useRecoilState(fetchAiBlocksState);
    const [activeCategory, setActiveCategory] =
        useRecoilState(activeCategoryState);
    const activeBlocks = useRecoilValue(activeAiBlocksState);
    const categories = useRecoilValue(availableCategoriesState);
    const blockDetails = useRecoilValue(blockDetailsState);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: promaAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const getActiveColor = () => {
        return categoryColors[activeCategory] || "purple";
    };

    useEffect(() => {
        setFetchAiBlocksState(false);
        fetchAiBlocks(localPromptMethod, localPromptCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className={styles.sidebar}>
                <div className={styles.categories} data-tour="categories">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className={`${styles.category} ${
                                activeCategory === category ? styles.active : ""
                            }`}
                            onClick={() => setActiveCategory(category)}
                            style={{
                                "--category-color": categoryColors[category],
                                "--category-active-color": `${categoryColors[category]}33`,
                            }}
                        >
                            <B5 color="white">{category}</B5>
                        </div>
                    ))}
                </div>
                {isLoading ? (
                    <div
                        className={`${styles.blocksContainer} ${styles.tourTarget}`}
                        style={{ "--active-color": getActiveColor() }}
                    >
                        <Droppable droppableId="sidebar_ai">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={styles.blocks}
                                    data-tour="blocks"
                                >
                                    {activeBlocks[activeCategory]?.map(
                                        (blockId, index) => {
                                            const block = blockDetails[blockId];
                                            return (
                                                <Draggable
                                                    key={blockId}
                                                    draggableId={`${blockId}|${activeCategory}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={
                                                                styles.block
                                                            }
                                                        >
                                                            <PromptValueBlock
                                                                color={
                                                                    categoryColors[
                                                                        activeCategory
                                                                    ]
                                                                }
                                                                value={
                                                                    block.blockValue
                                                                }
                                                                variant={
                                                                    categoryBlockShapes[
                                                                        activeCategory
                                                                    ]
                                                                }
                                                                size="medium"
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        },
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ) : (
                    <div className={styles.loadingSection}>
                        <B4>{t(`promptMaking.aiRecommend`)}</B4>
                        <Lottie
                            options={defaultOptions}
                            width={200}
                            height={200}
                            animationData={promaAnimation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AiBlockSection;
