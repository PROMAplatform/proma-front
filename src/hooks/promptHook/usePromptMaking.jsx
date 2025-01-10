import {useRecoilState, useRecoilValue} from "recoil";
import { enqueueSnackbar } from "notistack";
import {
    activeBlocksState,
    combinationsState,
    blockDetailsState,
    activeCategoryState, activeAiBlocksState,
    userHistoryState
} from "../../recoil/prompt/promptRecoilState";
import { useEffect } from "react";
import { t } from "i18next";
import { usePromptHook } from "../../api/prompt/prompt";

export const usePromptMaking = () => {
    const [combinations, setCombinations] = useRecoilState(combinationsState);
    const [activeBlocks, setActiveBlocks] = useRecoilState(activeBlocksState);
    const [activeAiBlocks, setActiveAiBlocks] = useRecoilState(activeAiBlocksState);
    const [userHistory, setUserHistoryState] = useRecoilState(userHistoryState);
    const blockDetails = useRecoilValue(blockDetailsState);
    const activeCategory = useRecoilValue(activeCategoryState);
    const { deleteBlock } = usePromptHook();
    // useEffect(() => {
    //     const newActiveBlocks = { ...activeBlocks };
    //     for (const category in newActiveBlocks) {
    //         newActiveBlocks[category] = newActiveBlocks[category]?.filter(
    //             (blockId) => combinations[category] !== blockId,
    //         );
    //     }
    //     setActiveBlocks(newActiveBlocks);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [combinations]);

    useEffect(() => {
        const newActiveBlocks = { ...activeBlocks };
        const newActiveAiBlocks = { ...activeAiBlocks };
        for (const category in newActiveBlocks) {
            newActiveBlocks[category] = newActiveBlocks[category]?.filter(
                (blockId) => combinations[category] !== blockId,
            );
            newActiveAiBlocks[category] = newActiveAiBlocks[category]?.filter(
                (blockId) => combinations[category] !== blockId,
            );
        }
        setActiveBlocks(newActiveBlocks);
        setActiveAiBlocks(newActiveAiBlocks);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [combinations]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        const [blockId, blockCategory, isBlockDefault] = draggableId.split("|");
        const numericBlockId = parseInt(blockId);

        if (!blockDetails[numericBlockId]) {
            console.error("Block not found:", numericBlockId);
            return;
        }

        // if (destination.droppableId === "deleteArea") {
        //     console.log(draggableId);
        //     handleDeleteBlock(
        //         source.droppableId,
        //         numericBlockId,
        //         isBlockDefault,
        //     );
        // } else if (
        //     source.droppableId === "sidebar" &&
        //     destination.droppableId !== "sidebar"
        // ) {
        //     handleSidebarToCombinationArea(
        //         destination.droppableId,
        //         numericBlockId,
        //         blockCategory,
        //     );
        // } else if (
        //     source.droppableId !== "sidebar" &&
        //     destination.droppableId === "sidebar"
        // ) {
        //     handleCombinationAreaToSidebar(source.droppableId, numericBlockId);
        // } else if (
        //     source.droppableId !== "sidebar" &&
        //     destination.droppableId !== "sidebar"
        // ) {
        //     handleWithinCombinationArea(
        //         source.droppableId,
        //         destination.droppableId,
        //         numericBlockId,
        //     );
        // }

        if (destination.droppableId === "deleteArea") {
            handleDeleteBlock(
                source.droppableId,
                numericBlockId,
                isBlockDefault,
            );
        } else if (
            (source.droppableId === "sidebar" || source.droppableId === "sidebar_ai") &&
            destination.droppableId !== "sidebar" &&
            destination.droppableId !== "sidebar_ai"
        ) {
            handleSidebarToCombinationArea(
                destination.droppableId,
                numericBlockId,
                blockCategory,
                source.droppableId,
            );
        } else if (
            source.droppableId !== "sidebar" &&
            source.droppableId !== "sidebar_ai" &&
            (destination.droppableId === "sidebar" || destination.droppableId === "sidebar_ai")
        ) {
            handleCombinationAreaToSidebar(source.droppableId, numericBlockId, destination.droppableId);
        } else if (
            source.droppableId !== "sidebar" &&
            source.droppableId !== "sidebar_ai" &&
            destination.droppableId !== "sidebar" &&
            destination.droppableId !== "sidebar_ai"
        ) {
            handleWithinCombinationArea(
                source.droppableId,
                destination.droppableId,
                numericBlockId,
            );
        }
    };

    // const handleSidebarToCombinationArea = (
    //     category,
    //     blockId,
    //     blockCategory,
    // ) => {
    //     if (category !== blockCategory) {
    //         enqueueSnackbar(
    //             `${t(`promptMaking.userPromptError`)} ${blockCategory} ${t(`promptMaking.userPromptError2`)}`,
    //         );
    //         return;
    //     }
    //
    //     setCombinations((prev) => ({
    //         ...prev,
    //         [category]: blockId,
    //     }));
    //
    //     setActiveBlocks((prev) => ({
    //         ...prev,
    //         [category]: prev[category].filter((id) => id !== blockId),
    //     }));
    //
    //     handleCombinationChange({
    //         ...combinations,
    //         [category]: blockId,
    //     });
    // };

    const handleSidebarToCombinationArea = (
        category,
        blockId,
        blockCategory,
        sourceDroppableId,
    ) => {
        if (category !== blockCategory) {
            enqueueSnackbar(
                `${t(`promptMaking.userPromptError`)} ${blockCategory} ${t(`promptMaking.userPromptError2`)}`,
            );
            return;
        }

        setCombinations((prev) => ({
            ...prev,
            [category]: blockId,
        }));

        setUserHistoryState((prev) => {
            const prevEntries = typeof prev === 'string' ? prev.split('\n') : [];
            const nextNumber = prevEntries.length + 1;
            const description = blockDetails[blockId]?.blockDescription || 'Description not found';
            const newEntry = `${nextNumber}. ${category}에서 ${description}을 선택했습니다`;
            return prevEntries.length > 0 ? `${prevEntries.join('\n')}\n${newEntry}` : newEntry;
        });


        if (sourceDroppableId === "sidebar") {
            setActiveBlocks((prev) => ({
                ...prev,
                [category]: prev[category].filter((id) => id !== blockId),
            }));
        } else if (sourceDroppableId === "sidebar_ai") {
            setActiveAiBlocks((prev) => ({
                ...prev,
                [category]: prev[category].filter((id) => id !== blockId),
            }));
        }

        handleCombinationChange({
            ...combinations,
            [category]: blockId,
        });
    };

    // const handleCombinationAreaToSidebar = (category, blockId) => {
    //     setCombinations((prev) => ({
    //         ...prev,
    //         [category]: null,
    //     }));
    //
    //     setActiveBlocks((prev) => ({
    //         ...prev,
    //         [category]: [...prev[category], blockId],
    //     }));
    // };

    const handleCombinationAreaToSidebar = (category, blockId, destinationDroppableId) => {
        setCombinations((prev) => ({
            ...prev,
            [category]: null,
        }));

        if (destinationDroppableId === "sidebar") {
            setActiveBlocks((prev) => ({
                ...prev,
                [category]: [...prev[category], blockId],
            }));
        } else if (destinationDroppableId === "sidebar_ai") {
            setActiveAiBlocks((prev) => ({
                ...prev,
                [category]: [...prev[category], blockId],
            }));
        }
    };

    const handleWithinCombinationArea = (
        sourceCategory,
        destinationCategory,
        blockId,
    ) => {
        if (sourceCategory !== destinationCategory) {
            enqueueSnackbar(
                `${t(`promptMaking.userPromptError3`)} ${sourceCategory}${t(`promptMaking.userPromptError4`)} ${destinationCategory}`,
            );
            return;
        }

        // 같은 카테고리 내에서의 이동이므로 아무 작업도 필요하지 않습니다.
        // 하지만 필요하다면 여기에 추가 로직을 구현할 수 있습니다.
    };

    const handleCombinationChange = (newCombinations) => {
        console.log("새로운 조합:", newCombinations);
        console.log("조합 시도");
        console.log(userHistory);
        // 여기에 조합 변경에 따른 추가 로직을 구현할 수 있습니다.
    };

    const handleDeleteBlock = (sourceCategory, blockId, isDefault) => {
        if (sourceCategory === "sidebar" || sourceCategory === "sidebar_ai") {
            if (isDefault === "true") {
                // isDefault는 문자열로 전달될 수 있으므로 문자열 비교
                console.log("Cannot delete default block");
                enqueueSnackbar(t("promptMaking.blockDeleteFailed"), {
                    variant: "warning",
                });
            } else {
                console.log("Deleting custom block");
                deleteBlock(blockId);
                setActiveBlocks((prev) => ({
                    ...prev,
                    [activeCategory]: prev[activeCategory].filter(
                        (id) => id !== blockId,
                    ),
                }));
                enqueueSnackbar(t("promptMaking.blockDeleted"), {
                    variant: "success",
                });
            }
        } else {
            console.log("Removing block from combination area");
            setCombinations((prev) => ({
                ...prev,
                [sourceCategory]: null,
            }));
            enqueueSnackbar(t("promptMaking.blockDeleted"), {
                variant: "success",
            });
        }
    };
    return { onDragEnd };
};
