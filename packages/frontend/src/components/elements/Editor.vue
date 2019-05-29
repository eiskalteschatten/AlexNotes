<template>
    <div ref="editor" class="editor" />
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

    export default Vue.extend({
        data() {
            return {
                editor: null,
                diffEditor: false,
                value: 'test',
                language: 'markdown',
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            editorTheme(): string {
                return this.theme === 'dark' ? 'vs-dark': 'vs';
            }
        },
        mounted(): void {
            this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$refs.editor, {
                value: this.value,
                language: this.language,
                theme: this.editorTheme,
                automaticLayout: true
            });
            // this.diffEditor && this._setModel(this.value, this.original);
            // this._editorMounted(this.editor);
        },
        beforeDestroy() {
            this.editor && this.editor.dispose();
        }
    });
</script>

<style lang="scss" scoped>
    .editor {
        height: 100%;
        width: 100%;
    }
</style>
