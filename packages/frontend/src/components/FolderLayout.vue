<template>
    <v-layout>
        <v-flex xs12 md3>
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
                    ></v-divider>

                    <v-list-tile
                        v-else
                        :key="note.title"
                        avatar
                        @click=""
                    >
                        <v-list-tile-avatar>
                            <img :src="note.avatar">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="note.title" />
                            <v-list-tile-sub-title v-html="note.subtitle" />
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-flex>
        <v-flex xs12 md9>
            <router-view />
        </v-flex>
    </v-layout>
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
        async created(): void {
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
