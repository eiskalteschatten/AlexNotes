<template>
    <div ref="editor" class="editor" />
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations } from 'vuex';

    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

    export default Vue.extend({
        data() {
            return {
                editor: null,
                diffEditor: false,
                language: 'markdown',
                model: null,
                initialContentSet: false
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('editor', [
                'content'
            ]),
            editorTheme(): string {
                return this.theme === 'dark' ? 'vs-dark': 'vs';
            }
        },
        watch: {
            content(newContent: string): void {
                // This whole function is a nasty hack since Vuex store values aren't
                // available in the mounted hook.
                if (!this.initialContentSet) {
                    this.model.setValue(newContent);
                }
            }
        },
        mounted(): void {
            this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$refs.editor, {
                value: this.content,
                language: this.language,
                theme: this.editorTheme,
                automaticLayout: true
            });

            this.editor.onDidChangeModelContent((): void => {
                this.$nextTick((): void => {
                    this.setContent(this.editor.getValue());
                    this.initialContentSet = true;
                });
            });

            this.model = monaco.editor.createModel(this.content, this.language);
            this.editor.setModel(this.model);
        },
        beforeDestroy() {
            this.editor && this.editor.dispose();
        },
        methods: {
            ...mapMutations('editor', [
                'setContent'
            ])
        }
    });
</script>

<style lang="scss" scoped>
    .editor {
        height: 100%;
        width: 100%;
    }
</style>
