export const setLocalPromptMethod = (type) => {
    localStorage.setItem("LocalPromptMehthod", type);
};

export const getLocalPromptMethod = () => {
    const localPromptMethod = localStorage.getItem("LocalPromptMehthod");
    return localPromptMethod;
};

export const getTourFinished = () => {
    const tourFinished = localStorage.getItem("tourFinished");
    if (tourFinished === 'false') {
        return false;
    } else {
        return true;
    }
}

export const setTourFinish = (tourFinished) => {
    localStorage.setItem("tourFinished", tourFinished.toString());
}

export const getIsFirstVisited = () => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited === 'false') {
        return false;
    } else {
        localStorage.setItem("hasVisited", 'true');
        return true;
    }
};

export const setIsFirstVisited = (isFirstVisit) => {
    localStorage.setItem("hasVisited", isFirstVisit.toString());
};

export const setLocalPromptCategory = (type) => {
    localStorage.setItem("LocalPromptCategory", type);
};

export const getLocalPromptCategory = () => {
    const LocalPromptCategory = localStorage.getItem("LocalPromptCategory");
    return LocalPromptCategory;
};
