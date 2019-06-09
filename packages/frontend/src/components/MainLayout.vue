<template>
    <div class="fill-page">
        <side-nav />
        <toolbar />
        <v-content class="fill-page">
            <v-layout v-if="selectedFolderId" fill-height>
                <v-flex
                    xs12
                    lg3
                    :class="{'mobile-middle-view': $vuetify.breakpoint.mdAndDown}"
                    ref="middleView"
                >
                    <div class="middle-view">
                        <notes-list v-if="selectedFolderId" @noteSelected="selectNote" />
                    </div>
                </v-flex>
                <v-flex
                    xs12
                    lg9
                    :class="{'mobile-main-view': $vuetify.breakpoint.mdAndDown}"
                    ref="mainView"
                    grow
                >
                    <v-container fluid fill-height pa-0>
                        <router-view />
                    </v-container>
                </v-flex>
            </v-layout>
            <v-container v-else fluid fill-height>
                <router-view />
            </v-container>
        </v-content>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import eventBus from '../eventBus';

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
            ]),
            ...mapState('notes', [
                'selectedNoteId',
            ])
        },
        created(): void {
            eventBus.$on('mobile-go-back-to-middle-view', this.mobileGoBackToMiddleView);
        },
        methods: {
            selectNote(): void {
                if (this.$vuetify.breakpoint.mdAndDown) {
                    this.$refs.middleView.style.left = '-100%';
                    this.$refs.mainView.style.left = '0';
                }
            },
            mobileGoBackToMiddleView(): void {
                this.$refs.middleView.style.left = '0';
                this.$refs.mainView.style.left = '100%';
            }
        }
    });
</script>

<style lang="scss" scoped>
    .fill-page {
        height: 100%;
        width: 100%;
    }

    .middle-view {
        height: calc(100vh - 64px);
        overflow: auto;
    }

    .mobile-middle-view, .mobile-main-view {
        height: 100%;
        overflow: auto;
        position: absolute;
        top: 0;
        transition: 250ms left;
        width: 100%;
    }

    .mobile-middle-view {
        left: 0;
    }

    .mobile-main-view {
        left: 100%;
    }
</style>
