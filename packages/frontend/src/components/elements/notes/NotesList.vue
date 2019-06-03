<i18n>
{
    "en": {
        "createNote": "Create Note"
    },
    "de": {
        "createNote": "Notiz erstellen"
    }
}
</i18n>

<template>
    <v-layout column fill-height>
        <v-flex shrink>
            <sub-toolbar class="text-xs-center">
                <v-btn @click="createNote">
                    <v-icon left>add</v-icon>
                    {{ $t('createNote') }}
                </v-btn>
            </sub-toolbar>
        </v-flex>
        <v-flex grow>
            <v-list two-line class="fill-height">
                <template v-for="note in notes">
                    <v-list-tile
                        :key="note.id"
                        :avatar="note.icon"
                        @click="selectNote(note.id)"
                        :class="getActiveClass(selectedNoteId === note.id)"
                        ripple
                    >
                        <v-list-tile-avatar v-if="note.icon">
                            <img :src="note.icon">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ note.title }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                                <span class="date">
                                    {{ $d(new Date(note.dateUpdated), 'numeric') }}
                                </span>
                                {{ preparePreview(note.content) }}
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations } from 'vuex';

    import eventBus from '../../../eventBus';

    import SubToolbar from '../../elements/toolbars/SubToolbar.vue';

    export default Vue.extend({
        components: {
            SubToolbar
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('notes', [
                'notes',
                'selectedNoteId',
                'selectedNote'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        created(): void {
            eventBus.$on('selectNote', (noteId: string) => {
                this.selectNote(noteId, false);
            });
        },
        methods: {
            ...mapMutations('notes', [
                'setSelectedNoteId',
                'setSelectedNote',
                'resetSelectedNote'
            ]),
            ...mapMutations('markdownViewer', [
                'setRenderedHtml'
            ]),
            ...mapMutations('editor', {
                setEditorContent: 'setAllContent',
                resetEditorContent: 'resetContent'
            }),
            preparePreview(content: string): string {
                let preview: string = content.replace(/<[^>]*>?/g, '');
                preview = preview.substring(0, 75);
                return preview;
            },
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            selectNote(id: string, push: boolean = true): void {
                this.setSelectedNoteId(id);
                this.setSelectedNote(id);
                this.$emit('noteSelected');
                this.setRenderedHtml(this.selectedNote.content);
                this.setEditorContent(this.selectedNote.markdown);

                if (push) {
                    this.$router.push({ name: 'note', params: { note: id } });
                }
            },
            createNote(): void {
                this.resetSelectedNote();
                this.resetEditorContent();
                this.$router.push({ name: 'newNote' });
            }
        }
    });
</script>

<style lang="scss" scoped>
    .fill-height {
        height: 100%;
    }

    .active {
        background-color: rgba(255, 255, 255, 0.08);
    }

    .active-light {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .date {
        display: inline-block;
        font-weight: bold;
        margin-right: 12px;
    }
</style>
