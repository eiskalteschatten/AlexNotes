<template>
    <v-list two-line>
        <template v-for="(note, index) in notes">
            <v-subheader
                v-if="note.header"
                :key="note.header"
            >
                {{ note.header }}
            </v-subheader>

            <v-divider
                v-else-if="note.divider"
                :key="index"
                :inset="note.inset"
            />

            <v-list-tile
                v-else
                :key="note.title"
                avatar
            >
                <v-list-tile-avatar>
                    <img :src="note.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                    <v-list-tile-title>
                        {{ note.title }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                        {{ note.subtitle }}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
    </v-list>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapActions } from 'vuex';

    export default Vue.extend({
        computed: {
            ...mapState('folders', [
                'selectedFolderId'
            ]),
            ...mapState('notes', [
                'notes'
            ])
        },
        async created(): Promise<void> {
            await this.getNotes();
        },
        methods: {
            ...mapActions('notes', [
                'getNotes'
            ])
        }
    });
</script>

<style lang="scss">

</style>
