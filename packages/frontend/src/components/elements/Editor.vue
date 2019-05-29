<template>
    <div ref="editor" class="editor" />
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

    const assetsPath = './assets/';

    function getWorkerUrl(workerId: string, label: string): string {
        switch (label) {
            case 'json':
                return assetsPath + 'json.worker.js';
            case 'css':
            case 'less':
            case 'scss':
                return assetsPath + 'css.worker.js';
            case 'html':
            case 'handlebars':
            case 'razor':
                return assetsPath + 'html.worker.js';
            case 'javascript':
            case 'typescript':
                return assetsPath + 'typescript.worker.js';
            default:
                return assetsPath + 'editor.worker.js';
        }
    }

    self.MonacoEnvironment = { getWorkerUrl };

    export default Vue.extend({
        data() {
            return {
                editor: null,
                diffEditor: false,
                value: '# test',
                language: 'markdown',
                model: null
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

            this.editor.onDidChangeModelContent((): void => {
                this.value = this.editor.getValue();
            });

            this.model = monaco.editor.createModel(this.value, this.language);
            this.editor.setModel(this.model);
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
