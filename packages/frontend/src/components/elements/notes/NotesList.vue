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
                'selectedNoteId'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        async created(): Promise<void> {
            await this.getNotes();
        },
        methods: {
            ...mapActions('notes', [
                'getNotes'
            ]),
            ...mapMutations('notes', [
                'setSelectedNoteId'
            ]),
            preparePreview(content: string): string {
                let preview: string = content.replace(/<[^>]*>?/g, '');
                preview = preview.substring(0, 75);
                return preview;
            },
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            selectNote(id: string): void {
                this.setSelectedNoteId(id);
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
