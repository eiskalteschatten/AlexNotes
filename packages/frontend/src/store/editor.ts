export default {
    namespaced: true,
    state: {
        content: '',
        originalContent: ''
    },

    getters: {
        content: (state): string => state.content,
        originalContent: (state): string => state.originalContent
    },

    mutations: {
        setContent(state, content: string): void {
            state.content = content;
        },
        setOriginalContent(state, originalContent: string): void {
            state.originalContent = originalContent;
        },
        setAllContent(state, content: string): void {
            state.content = content;
            state.originalContent = content;
        },
        resetContent(state): void {
            state.content = state.originalContent;
        }
    }
};
