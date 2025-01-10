import React, {useEffect, useState} from 'react';
import styles from "./BlockSection.module.css";
import {B5} from "../../../../styles/font-styles";
import {Draggable, Droppable} from "react-beautiful-dnd";
import PromptValueBlock from "../../../common/Prompt/PromptValueBlock";
import {t} from "i18next";
import CreateBlockModal from "../CreateBlockModal";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    activeBlocksState, activeCategoryState, availableCategoriesState, blockDetailsState,
    categoryBlockShapesState,
    categoryColorsState,
} from "../../../../recoil/prompt/promptRecoilState";
import {getLocalPromptMethod} from "../../../../util/localStorage";
import {usePromptHook} from "../../../../api/prompt/prompt";

function BlockSection() {
    const categoryColors = useRecoilValue(categoryColorsState);
    const categoryBlockShapes = useRecoilValue(categoryBlockShapesState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const localPromptMethod = getLocalPromptMethod();
    const { fetchBlocks } = usePromptHook();

    const [activeCategory, setActiveCategory] = useRecoilState(activeCategoryState);
    const activeBlocks = useRecoilValue(activeBlocksState);
    const categories = useRecoilValue(availableCategoriesState);
    const blockDetails = useRecoilValue(blockDetailsState);

    const getActiveColor = () => {
        return categoryColors[activeCategory] || "purple";
    };

    useEffect(() => {
        fetchBlocks(localPromptMethod);
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
                <div
                    className={`${styles.blocksContainer} ${styles.tourTarget}`}
                    style={{ "--active-color": getActiveColor() }}
                >
                    <Droppable droppableId="sidebar">
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
                                                draggableId={`${blockId}|${activeCategory}|${block.isDefault}`}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={styles.block}
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
                    <button
                        className={styles.addButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <B5 color="blockMainColor">
                            {t(`promptMaking.blockMake`)}
                        </B5>
                    </button>
                </div>
            </div>
            <CreateBlockModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
            />
        </div>
    );
}

export default BlockSection;
