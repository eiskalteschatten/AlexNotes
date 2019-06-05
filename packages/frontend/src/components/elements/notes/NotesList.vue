<i18n>
{
    "en": {
        "createNote": "Create Note",
        "deleteNote": "Delete Note"
    },
    "de": {
        "createNote": "Notiz erstellen",
        "deleteNote": "Notiz löschen"
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
                        @contextmenu="showContextMenu($event, note.id)"
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
                                {{ note.excerpt }}
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-flex>

        <v-menu
            v-model="contextMenuShown"
            :position-x="cmX"
            :position-y="cmY"
            absolute
            offset-y
        >
            <v-list>
                <v-list-tile @click="showDeleteFolderConfirmDialog = true">
                    <v-list-tile-action>
                        <v-icon>delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t('deleteNote') }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations, mapActions } from 'vuex';

    import eventBus from '../../../eventBus';

    import SubToolbar from '../../elements/toolbars/SubToolbar.vue';

    export default Vue.extend({
        components: {
            SubToolbar
        },
        data() {
            return {
                contextMenuShown: false,
                cmX: 0,
                cmY: 0,
                contextMenuNoteId: ''
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('notes', [
                'notes',
                'selectedNoteId',
                'selectedNote',
                'selectedNoteMenuItem'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        created(): void {
            eventBus.$on('selectNote', (noteId: string): void => {
                this.selectNote(noteId, false);
            });

            eventBus.$on('close-all-context-menus', (): void => {
                this.contextMenuShown = false;
            });
        },
        methods: {
            ...mapMutations('notes', [
                'setSelectedNoteId',
                'setSelectedNoteMenuItem',
                'resetSelectedNote'
            ]),
            ...mapActions('notes', [
                'getSelectedNote'
            ]),
            ...mapMutations('markdownViewer', [
                'setRenderedHtml'
            ]),
            ...mapMutations('editor', {
                setEditorContent: 'setAllContent',
                resetEditorContent: 'resetContent',
                setEditorAdditionalFields: 'setAdditionalFields'
            }),
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            async selectNote(id: string, push: boolean = true): Promise<void> {
                this.setSelectedNoteId(id);
                this.setSelectedNoteMenuItem(id);
                await this.getSelectedNote(id);

                this.$emit('noteSelected');

                this.setRenderedHtml(this.selectedNote.html);
                this.setEditorContent(this.selectedNote.markdown);
                this.setEditorAdditionalFields({ title: this.selectedNoteMenuItem.title });

                if (push) {
                    this.$router.push({ name: 'note', params: { note: id } });
                }
            },
            createNote(): void {
                this.resetSelectedNote();
                this.resetEditorContent();
                this.$router.push({ name: 'newNote' });
            },
            showContextMenu(event: any, id: string): void {
                event.preventDefault();
                eventBus.$emit('close-all-context-menus');
                this.cmX = event.clientX;
                this.cmY = event.clientY;
                this.contextMenuNoteId = id;
                this.$nextTick(() => this.contextMenuShown = true);
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
