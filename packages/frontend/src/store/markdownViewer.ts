export default {
    namespaced: true,
    state: {
        renderedHtml: ''
    },

    getters: {
        renderedHtml: (state): string => state.renderedHtml
    },

    mutations: {
        setRenderedHtml(state, renderedHtml: string): void {
            state.renderedHtml = renderedHtml;
        }
    }
};
