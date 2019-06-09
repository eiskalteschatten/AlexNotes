export default {
    namespaced: true,
    state: {
        title: '',
        renderedHtml: ''
    },

    getters: {
        title: (state): string => state.title,
        renderedHtml: (state): string => state.renderedHtml
    },

    mutations: {
        setTitle(state, title: string): void {
            state.title = title;
        },
        setRenderedHtml(state, renderedHtml: string): void {
            state.renderedHtml = renderedHtml;
        }
    }
};
