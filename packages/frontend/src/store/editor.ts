export default {
    namespaced: true,
    state: {
        content: '',
        originalContent: '',
        additionalFields: {}
    },

    getters: {
        content: (state): string => state.content,
        originalContent: (state): string => state.originalContent,
        additionalFields: (state): string => state.additionalFields
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
        resetToOriginalContent(state): void {
            state.content = state.originalContent;
        },
        resetContent(state): void {
            state.content = '';
            state.originalContent = '';
        },
        setAdditionalFields(state, additionalFields: any): void {
            state.additionalFields = additionalFields;
        }
    }
};
