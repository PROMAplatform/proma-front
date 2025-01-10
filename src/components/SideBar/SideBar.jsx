import React, { useState } from "react";
import styles from "./SideBar.module.css";
import ChattingList from "./components/Chat/ChattingList";
import Toggle from "./components/Toggle";
import PromptList from "./components/Prompt/PromptList";
import AddButton from "./components/AddButton";
import promaLogoSmall from "../../assets/logos/promaLogoSmall.svg";
import CreatePromptModal from "./components/Prompt/Modal/CreatePromptModal";
import { useChattingRoomHooks } from "../../api/chatting/chatting";
import { t } from "i18next";

function SideBar() {
    const [isChatting, setIsChatting] = useState(false);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const { getChattingRoomList } = useChattingRoomHooks();
    // const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가

    const handleAddChattingRoom = async () => {
        await getChattingRoomList(); // 새로운 채팅방 목록
        window.location.reload(); // 페이지 새로고침
    };

    const closePromptModal = () => {
        setIsPromptModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <img className={styles.logo} src={promaLogoSmall} alt="logo" />
            <Toggle isChatting={isChatting} setIsChatting={setIsChatting} />
            {isChatting ? (
                <div className={styles.listContainer}>
                    <ChattingList />
                    <div onClick={handleAddChattingRoom}>
                        <AddButton text={t(`sideBar.addNewChatting`)} />
                    </div>
                </div>
            ) : (
                <div className={styles.listContainer}>
                    <PromptList />
                    <AddButton
                        text={t(`sideBar.addNewPrompt`)}
                        onClick={() => setIsPromptModalOpen(true)}
                    />
                </div>
            )}
            <CreatePromptModal
                isOpen={isPromptModalOpen}
                onClose={closePromptModal}
            />
        </div>
    );
}

export default SideBar;
