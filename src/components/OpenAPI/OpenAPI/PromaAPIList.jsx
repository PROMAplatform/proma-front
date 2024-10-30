import React, { useEffect, useState } from "react";
import { useOpenAPIHook } from "../../../api/business/openAPI";
import { openapiListState } from "../../../recoil/openapi/openapiState";
import CopyButton from "./components/CopyButton";
import { useRecoilValue } from "recoil";
import { B1, B5 } from "../../../styles/font-styles";
import PromptDetailModal from "./modal/PromptDetailModal";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import styles from "./PromaAPIList.module.css";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PromaAPIList() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPromptId, setSelectedPromptId] = useState(null);
    const { fetchOpenAPIList, makeOpenAPI } = useOpenAPIHook();
    const openapiList = useRecoilValue(openapiListState);

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchDate = async () => {
            await fetchOpenAPIList();
        };
        fetchDate();
        // eslint-disable-next-line
    }, [openapiList]);

    const handleTitleClick = (id) => {
        setSelectedPromptId(id);
        setIsDetailModalOpen(true);
    };

    const reissueOpenAPI = (prompt) => {
        const fetchData = async () => {
            await makeOpenAPI(prompt.promptId);
        };
        fetchData();
        setSnackbarOpen(true);
    };

    return (
        <div className={styles.container}>
            <B1>PROMA API 목록 관리</B1>
            <B5>프롬프트 이름을 클릭하면 프롬프트 상세 조회가 가능합니다!</B5>
            {openapiList.length !== 0 ? (
                <table>
                    <colgroup>
                        <col style={{ width: "30%" }} />
                        <col style={{ width: "50%" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>프롬프트 이름</th>
                            <th colSpan="2">키 정보</th>
                            <th>재발급</th>
                        </tr>
                    </thead>
                    <tbody>
                        {openapiList.map((prompt, index) => (
                            <React.Fragment key={prompt.promptId}>
                                <tr key={index}>
                                    <td
                                        className={styles.titleContainer}
                                        rowSpan="3"
                                        onClick={() =>
                                            handleTitleClick(prompt.promptId)
                                        }
                                    >
                                        {prompt.promptTitle}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.categoryContainer}>
                                        apiToken : {prompt.apiToken}
                                    </td>
                                    <td className={styles.copyContainer}>
                                        <CopyButton
                                            category="apiToken"
                                            text={prompt.apiToken}
                                        />
                                    </td>
                                    <td
                                        rowSpan="2"
                                        className={styles.reissueContainer}
                                    >
                                        <button
                                            onClick={() =>
                                                reissueOpenAPI(prompt)
                                            }
                                            className={styles.reissueButton}
                                        >
                                            재발급
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.categoryContainer}>
                                        secretKey : {prompt.secretKey}
                                    </td>
                                    <td className={styles.copyContainer}>
                                        <CopyButton
                                            category="secretKey"
                                            text={prompt.secretKey}
                                        />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyContainer}>
                    발급받은 PROMA API가 존재하지 않습니다.
                </div>
            )}
            <PromptDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                promptId={selectedPromptId}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {prompt.promptTitle} API가 재발행되었습니다!
                </Alert>
            </Snackbar>
        </div>
    );
}
export default PromaAPIList;
