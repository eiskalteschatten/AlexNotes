<template>
    <div>
        <side-nav />
        <toolbar />
        <v-content>
            <v-layout v-if="selectedFolderId">
                <v-flex xs12 md3>
                    <notes-list />
                </v-flex>
                <v-flex xs12 md9>
                    <v-container fluid>
                        <router-view />
                    </v-container>
                </v-flex>
            </v-layout>
            <v-container v-else fluid>
                <router-view />
            </v-container>
        </v-content>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import Toolbar from './elements/toolbars/Main.vue';
    import SideNav from './elements/SideNav.vue';
    import NotesList from './elements/notes/NotesList.vue';

    export default Vue.extend({
        components: {
            Toolbar,
            SideNav,
            NotesList
        },
        computed: {
            ...mapState('folders', [
                'selectedFolderId',
            ])
        }
    });
</script>

<style lang="scss">

</style>
