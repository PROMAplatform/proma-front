import { atom, selector } from "recoil";

// 타입별 카테고리 옵션
const categoryOptions = {
    task: ["화자", "청자", "지시", "형식", "필수", "제외"],
    character: ["역할", "성격", "배경", "규칙"],
};

// 활성 타입 상태
export const promptMethodState = atom({
    key: "promptMethodState",
    default: "Task/Research", // 기본 타입 설정
});
export const currentPromptState = atom({
    key: "currentPromptState",
    default: null,
});
const initialBlocks = {
    화자: [
        {
            blockId: 1,
            blockValue: "선생님",
            blockDescription: "당신은 친절하고 지식이 풍부한 선생님입니다.",
        },
        {
            blockId: 2,
            blockValue: "학생",
            blockDescription: "당신은 호기심 많고 열심히 공부하는 학생입니다.",
        },
    ],
    청자: [
        {
            blockId: 3,
            blockValue: "에세이",
            blockDescription: "주제에 대해 자유롭게 서술하는 형식입니다.",
        },
        {
            blockId: 4,
            blockValue: "보고서",
            blockDescription: "구조화된 형식으로 정보를 전달합니다.",
        },
    ],
    지시: [
        {
            blockId: 5,
            blockValue: "설명하세요",
            blockDescription: "주제에 대해 상세히 설명해주세요.",
        },
        {
            blockId: 6,
            blockValue: "비교하세요",
            blockDescription: "두 가지 이상의 대상을 비교해주세요.",
        },
    ],
    형식: [
        {
            blockId: 7,
            blockValue: "최신 연구",
            blockDescription: "최근의 연구 결과를 참고하세요.",
        },
        {
            blockId: 8,
            blockValue: "역사적 사실",
            blockDescription: "관련된 역사적 사실을 고려하세요.",
        },
    ],
    필수: [
        {
            blockId: 9,
            blockValue: "키워드 포함",
            blockDescription: "반드시 특정 키워드를 포함해야 합니다.",
        },
        {
            blockId: 10,
            blockValue: "예시 제시",
            blockDescription: "설명에 구체적인 예시를 포함해야 합니다.",
        },
    ],
    제외: [
        {
            blockId: 11,
            blockValue: "비속어",
            blockDescription: "비속어 사용을 피해주세요.",
        },
        {
            blockId: 12,
            blockValue: "편견적 표현",
            blockDescription: "편견이 드러나는 표현을 사용하지 마세요.",
        },
    ],
};

//프롬프트 리스트
export const promptListState = atom({
    key: "promptListState",
    default: [],
});

// 사용 가능한 모든 카테고리 목록
export const availableCategoriesState = atom({
    key: "availableCategoriesState",
    default: categoryOptions["task"],
});

// 활성 카테고리
export const activeCategoryState = atom({
    key: "activeCategoryState",
    default: selector({
        key: "availableCategoriesDefault",
        get: ({ get }) => {
            const categories = get(availableCategoriesState);
            return categories.length > 0 ? categories[0] : null;
        },
    }),
});

// 각 카테고리별 블록 ID
export const activeBlocksState = atom({
    key: "activeBlocksState",
    default: Object.fromEntries(
        Object.keys(initialBlocks).map((category) => [
            category,
            initialBlocks[category].map((block) => block.blockId),
        ]),
    ),
});

export const activeAiBlocksState = atom({
    key: "activeAiBlocksState",
    default: Object.fromEntries(
        Object.keys(initialBlocks).map((category) => [
            category,
            initialBlocks[category].map((block) => block.blockId),
        ]),
    ),
});

// 선택된 조합
export const combinationsState = atom({
    key: "combinationsState",
    default: {},
});

// 색상 정의
const predefinedColors = [
    "var(--block-main-color)",
    "var(--block-purple)",
    "var(--block-pink)",
    "var(--block-red)",
    "var(--block-orange)",
    "var(--block-green)",
    "var(--block-blue)",
];

// 블록 모양 정의
const predefinedShapes = [1, 2, 3, 4, 5, 6, 7];

// 카테고리별 색상
export const categoryColorsState = atom({
    key: "categoryColorsState",
    default: {
        화자: predefinedColors[0],
        청자: predefinedColors[1],
        지시: predefinedColors[2],
        형식: predefinedColors[3],
        필수: predefinedColors[4],
        제외: predefinedColors[5],
    },
});

// 카테고리별 블록 모양
export const categoryBlockShapesState = atom({
    key: "categoryBlockShapesState",
    default: selector({
        key: "activeCategoryDefault",
        get: ({ get }) => {
            const categories = get(availableCategoriesState);
            return categories.map((category, index) => [
                category,
                predefinedShapes[index % predefinedShapes.length],
            ]);
        },
    }),
});

// 블록 세부 정보
export const blockDetailsState = atom({
    key: "blockDetailsState",
    default: Object.fromEntries(
        Object.values(initialBlocks)
            .flat()
            .map((block) => [block.blockId, block]),
    ),
});

// 정제된 프롬프트 부분
export const refinedPromptPartsState = selector({
    key: "refinedPromptPartsState",
    get: ({ get }) => {
        const combinations = get(combinationsState);
        const categories = get(availableCategoriesState);
        const blockDetails = get(blockDetailsState);

        const promptParts = {};
        categories.forEach((category) => {
            if (combinations[category]) {
                const block = blockDetails[combinations[category]];
                promptParts[category] = block ? block.blockDescription : "";
            } else {
                promptParts[category] = "";
            }
        });

        return promptParts;
    },
});

export const promptEvaluationState = atom({
    key: "promptEvaluationState",
    default: null,
});

export const promptEvaluationLoadingState = atom({
    key: "promptEvaluationLoadingState",
    default: false,
});

export const promptEvaluationErrorState = atom({
    key: "promptEvaluationErrorState",
    default: null,
});

export const fetchAiBlocksState = atom({
    key: "fetchAiBlocksState",
    default: null,
});

export const userHistoryState = atom({
    key: "userHistoryState",
    default: "",
});

// // 각종 상태 초기화 함수
// export const useResetCategoriesOnTypeChange = () => {
//   return useRecoilCallback(({ snapshot, set }) => async () => {
//     const currentType = await snapshot.getPromise(promptMethodState);
//     const categories = categoryOptions[currentType];

//     // 각종 상태 초기화
//     set(availableCategoriesState, categories);
//     set(activeCategoryState, categories[0]);
//     set(combinationsState, {});
//     // activeBlocksState 초기화
//     const filteredBlocks = Object.fromEntries(
//       categories.map((category) => [
//         category,
//         initialBlocks[category]?.map((block) => block.blockId) || [],
//       ])
//     );
//     set(activeBlocksState, filteredBlocks);
//   });
// };

// // 프롬프트 전체 구조를 갱신하는 함수
// export const updateEntirePromptStructure =
//   ({ set }) =>
//   (newPromptStructure) => {
//     const { categories, blocks, combinations, colors, shapes } =
//       newPromptStructure;

//     // 카테고리 업데이트
//     set(availableCategoriesState, categories);

//     // 활성 카테고리 업데이트 (첫 번째 카테고리로 설정)
//     set(activeCategoryState, categories[0]);

//     // 각 카테고리별 블록 ID 업데이트
//     set(
//       activeBlocksState,
//       Object.fromEntries(
//         categories.map((category) => [
//           category,
//           blocks[category].map((block) => block.blockId),
//         ])
//       )
//     );

//     // 선택된 조합 업데이트
//     set(combinationsState, combinations);

//     // 카테고리별 색상 업데이트
//     set(categoryColorsState, colors);

//     set(categoryBlockShapesState, shapes);

//     // 블록 세부 정보 업데이트
//     set(
//       blockDetailsState,
//       Object.fromEntries(
//         Object.values(blocks)
//           .flat()
//           .map((block) => [block.blockId, block])
//       )
//     );
//   };

// // 새로운 함수: API 데이터로부터 프롬프트 구조 갱신
// export const updatePromptStructureFromApiData =
//   ({ set }) =>
//   (apiData) => {
//     const blocks = apiData.responseDto.selectBlock;

//     // 카테고리 추출 및 중복 제거
//     const categories = [...new Set(blocks.map((block) => block.blockCategory))];

//     // 블록을 카테고리별로 그룹화
//     const groupedBlocks = categories.reduce((acc, category) => {
//       acc[category] = blocks.filter(
//         (block) => block.blockCategory === category
//       );
//       return acc;
//     }, {});

//     // 색상 생성 (간단한 예시, 실제로는 더 복잡한 로직이 필요할 수 있습니다)
//     const colors = categories.reduce((acc, category, index) => {
//       acc[category] = predefinedColors[index % predefinedColors.length];
//       return acc;
//     }, {});

//     const shapes = categories.reduce((acc, category, index) => {
//       acc[category] = predefinedShapes[index % predefinedShapes.length];
//       return acc;
//     }, {});

//     // 상태 업데이트
//     // 1. 카테고리 설정
//     set(availableCategoriesState, categories);
//     // 2. 카테고리 중 첫번째로 active되게끔 설정
//     set(activeCategoryState, categories[0]);
//     // 3. 모든 카테고리들에 해당하는 블록들을 설정
//     set(
//       activeBlocksState,
//       Object.fromEntries(
//         categories.map((category) => [
//           category,
//           groupedBlocks[category].map((block) => block.blockId),
//         ])
//       )
//     );
//     // 4. combination 즉 조합은 초기화 맨 처음에는 아무것도 없으니.
//     set(combinationsState, {}); // 초기에는 선택된 조합이 없음
//     // 5. 카테고리에 Colors을 할당함. 해당 색상들로 블럭들을 구분할 것임.
//     set(categoryColorsState, colors);
//     // 6. 카테고리에 블럭모양을 할당한다.
//     set(categoryBlockShapesState, shapes);
//     // 7. 블럭들의 detail들을 할당한다.
//     set(
//       blockDetailsState,
//       Object.fromEntries(blocks.map((block) => [block.blockId, block]))
//     );
//   };

// 사용 예: 이중함수라 다음과 같이 써야함
// const updatePromptStructure = useSetRecoilState(updatePromptStructureFromApiData);
// updatePromptStructure(apiData);
