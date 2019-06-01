<template>
    <v-list two-line>
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
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapActions, mapMutations } from 'vuex';

    import eventBus from '../../../eventBus';

    export default Vue.extend({
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('folders', [
                'selectedFolderId'
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
        watch: {
            '$route.params.note'(note: string, oldNote: string): void {
                if (note !== oldNote) {
                    this.selectNote(note, false);
                }
            }
        },
        created(): void {
            eventBus.$on('selectNote', (noteId: string) => {
                this.selectNote(noteId, false);
            });
        },
        methods: {
            ...mapActions('notes', [
                'getNotes'
            ]),
            ...mapMutations('notes', [
                'setSelectedNoteId',
                'setSelectedNote'
            ]),
            ...mapMutations('markdownViewer', [
                'setRenderedHtml'
            ]),
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

                if (push) {
                    this.$router.push({ name: 'note', params: { note: id } });
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
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
