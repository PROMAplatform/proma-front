import { sendRequest } from "../request";
import { aiChatInstance, blockInstance, promptInstance } from "../instance";
import {
    activeBlocksState,
    activeAiBlocksState,
    // activeCategoryState,
    availableCategoriesState,
    blockDetailsState,
    categoryColorsState,
    combinationsState,
    categoryBlockShapesState,
    activeCategoryState,
    promptEvaluationState,
    promptEvaluationErrorState,
    fetchAiBlocksState,
} from "../../recoil/prompt/promptRecoilState";
import { useRecoilState, useSetRecoilState } from "recoil";

export const usePromptHook = () => {
    const setAvailableCategories = useSetRecoilState(availableCategoriesState);
    const [activeCategory, setActiveCategory] =
        useRecoilState(activeCategoryState);
    const setActiveBlocks = useSetRecoilState(activeBlocksState);
    const setActiveAiBlocks = useSetRecoilState(activeAiBlocksState);
    const setCombinations = useSetRecoilState(combinationsState);
    const setCategoryColors = useSetRecoilState(categoryColorsState);
    const setBlockDetails = useSetRecoilState(blockDetailsState);
    const setCategoryBlockShapes = useSetRecoilState(categoryBlockShapesState);
    const setEvaluation = useSetRecoilState(promptEvaluationState);
    const setEvaluationError = useSetRecoilState(promptEvaluationErrorState);
    const setFetchAiBlocksState = useSetRecoilState(fetchAiBlocksState);
    // 새로운 함수: API 데이터로부터 프롬프트 구조 갱신
    const updatePromptStructureFromApiData = (apiData) => {
        if (
            !apiData.responseDto ||
            !Array.isArray(apiData.responseDto.selectBlock)
        ) {
            console.error("Unexpected API response structure:", apiData);
            return;
        }

        const blocks = apiData.responseDto.selectBlock;
        blocks.forEach((block) => {
            if (!block.blockValue) {
                console.warn("Block missing blockValue:", block);
            }
        });

        console.log("blocks: ", blocks);
        // 카테고리 추출 및 중복 제거
        const categories = [
            ...new Set(blocks.map((block) => block.blockCategory)),
        ];
        console.log("categories: ", categories);

        // 블록을 카테고리별로 그룹화
        const groupedBlocks = categories.reduce((acc, category) => {
            acc[category] = blocks.filter(
                (block) => block.blockCategory === category,
            );
            return acc;
        }, {});
        console.log("groupedBlocks: ", groupedBlocks);

        // 색상 생성 (간단한 예시, 실제로는 더 복잡한 로직이 필요할 수 있습니다)
        const colors = categories.reduce((acc, category, index) => {
            const predefinedColors = [
                "var(--block-main-color)",
                "var(--block-purple)",
                "var(--block-pink)",
                "var(--block-red)",
                "var(--block-orange)",
                "var(--block-green)",
                "var(--block-blue)",
            ];
            acc[category] = predefinedColors[index % predefinedColors.length];
            return acc;
        }, {});
        console.log("colors: ", colors);
        // 블록 모양 정의
        const predefinedShapes = [1, 2, 3, 4, 5, 6, 7];

        // 블록 모양 정의
        const shapes = categories.reduce((acc, category, index) => {
            acc[category] = predefinedShapes[index % predefinedShapes.length];
            return acc;
        }, {});
        // 상태 업데이트
        // 1. 카테고리 설정
        setAvailableCategories(categories);
        // 2. 카테고리 중 첫번째로 active되게끔 설정
        //TODO- 에러나면 무조건 여기임 -QA 이후 확인
        // 2. activeCategory가 없거나 categories에 없는 경우에만 새로 설정
        if (!activeCategory || !categories.includes(activeCategory)) {
            setActiveCategory(categories[0] || null);
        }

        // 3. 모든 카테고리들에 해당하는 블록들을 설정
        const activeBlocksData = Object.fromEntries(
            categories.map((category) => [
                category,
                (groupedBlocks[category] || []).map((block) => block.blockId),
            ]),
        );
        console.log(activeBlocksData);
        // 3.5 active된 block들을 setting해준다.
        setActiveBlocks(activeBlocksData);

        // 4. combination 즉 조합은 초기화 맨 처음에는 아무것도 없으니.
        setCombinations({});

        // 5. 카테고리에 Colors을 할당함. 해당 색상들로 블럭들을 구분할 것임.
        setCategoryColors(colors);

        // 6. 블럭들의 모양을 정해준다.
        setCategoryBlockShapes(shapes);

        // 7. 블럭들의 detail들을 할당한다.
        setBlockDetails(
            Object.fromEntries(blocks.map((block) => [block.blockId, block])),
        );
    };

    const fetchBlocks = async (promptMethod) => {
        const params = {
            promptMethod: promptMethod,
        };

        const response = await sendRequest(blockInstance, "get", ``, {
            params,
        });
        await updatePromptStructureFromApiData(response.data);
    };

    const updateAiPromptStructureFromApiData = (apiData) => {
        if (
            !apiData.responseDto ||
            !Array.isArray(apiData.responseDto.selectBlock)
        ) {
            console.error("Unexpected API response structure:", apiData);
            return;
        }

        const blocks = apiData.responseDto.selectBlock;
        blocks.forEach((block, index) => {
            if (!block.blockValue) {
                console.warn("Block missing blockValue:", block);
            }
            if (!block.blockId) {
                block.blockId = 10000 + index;
                console.warn(`Generated blockId for block:`, block);
            }
        });

        console.log("blocks: ", blocks);
        // 카테고리 추출 및 중복 제거
        const categories = [
            ...new Set(blocks.map((block) => block.blockCategory)),
        ];
        console.log("categories: ", categories);

        // 블록을 카테고리별로 그룹화
        const groupedBlocks = categories.reduce((acc, category) => {
            acc[category] = blocks.filter(
                (block) => block.blockCategory === category,
            );
            return acc;
        }, {});
        console.log("groupedBlocks: ", groupedBlocks);

        // 색상 생성 (간단한 예시, 실제로는 더 복잡한 로직이 필요할 수 있습니다)
        const colors = categories.reduce((acc, category, index) => {
            const predefinedColors = [
                "var(--block-main-color)",
                "var(--block-purple)",
                "var(--block-pink)",
                "var(--block-red)",
                "var(--block-orange)",
                "var(--block-green)",
                "var(--block-blue)",
            ];
            acc[category] = predefinedColors[index % predefinedColors.length];
            return acc;
        }, {});
        console.log("colors: ", colors);
        // 블록 모양 정의
        //const predefinedShapes = [1, 2, 3, 4, 5, 6, 7];

        // 블록 모양 정의
        // const shapes = categories.reduce((acc, category, index) => {
        //     acc[category] = predefinedShapes[index % predefinedShapes.length];
        //     return acc;
        // }, {});
        // 상태 업데이트
        // 1. 카테고리 설정
        //setAiAvailableCategories(categories);
        // 2. 카테고리 중 첫번째로 active되게끔 설정
        //TODO- 에러나면 무조건 여기임 -QA 이후 확인
        // 2. activeCategory가 없거나 categories에 없는 경우에만 새로 설정
        // if (!aiActiveCategory || !categories.includes(aiActiveCategory)) {
        //     setAiActiveCategory(categories[0] || null);
        // }

        // 3. 모든 카테고리들에 해당하는 블록들을 설정
        const activeBlocksData = Object.fromEntries(
            categories.map((category) => [
                category,
                (groupedBlocks[category] || []).map((block) => block.blockId),
            ]),
        );
        console.log(activeBlocksData);
        // 3.5 active된 block들을 setting해준다.
        setActiveAiBlocks(activeBlocksData);

        // 7. 블럭들의 detail들을 추가 할당한다.
        setBlockDetails((prevBlockDetails) => {
            const newBlocks = Object.fromEntries(
                blocks.map((block) => [block.blockId, block]),
            );
            return { ...prevBlockDetails, ...newBlocks };
        });
    };

    const fetchAiBlocks = async (promptMethod, promptCategory) => {
        const params = {
            promptMethod: promptMethod,
            promptCategory: promptCategory,
        };

        const response = await sendRequest(
            aiChatInstance,
            "get",
            `/recommend`,
            {
                params,
            },
        );
        await updateAiPromptStructureFromApiData(response.data);
        setFetchAiBlocksState(true);
    };

    const makeBlock = async (
        blockValue,
        blockDescription,
        blockCategory,
        promptMethod,
    ) => {
        await sendRequest(blockInstance, "post", ``, {
            blockValue,
            blockDescription,
            blockCategory,
            promptMethod,
        });
    };

    const deleteBlock = async (blockId) => {
        await sendRequest(blockInstance, "delete", `/${blockId}`, {
            blockId,
        });
    };

    const savePrompt = async (
        promptTitle,
        promptDescription,
        promptPreview,
        promptCategory,
        promptMethod,
        listPromptAtom,
        aiListPromptAtom,
    ) => {
        await sendRequest(promptInstance, "post", ``, {
            promptTitle,
            promptDescription,
            promptPreview,
            promptCategory,
            promptMethod,
            listPromptAtom,
            aiListPromptAtom,
        });
        //TODO- ㅡ프롬프트 생성 후에, 프롬프트 리스트를 다시 불러오는 것
        // await fetchPromptList();
    };

    const evaluatePrompt = async (promptId) => {
        setEvaluationError(null);
        setEvaluation(null);
        const response = await sendRequest(
            aiChatInstance,
            "post",
            `/evaluation`,
            {
                promptId,
            },
        );
        if (response.data.error == null) {
            setEvaluation(response.data.responseDto);
        } else {
            setEvaluationError(response.data.error);
        }
        return response;
    };

    const userHistory = async (userHistory, promptMethod, promptCategory) => {
        const response = await sendRequest(promptInstance, "post", `/history`, {
            promptHistory: userHistory,
            promptMethod: promptMethod,
            promptCategory: promptCategory,
        });
        return response;
    };

    return {
        fetchBlocks,
        makeBlock,
        savePrompt,
        deleteBlock,
        evaluatePrompt,
        fetchAiBlocks,
        userHistory,
    };
};
