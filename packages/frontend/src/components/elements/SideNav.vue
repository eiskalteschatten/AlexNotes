<i18n>
{
    "en": {
        "settings": "Settings"
    },
    "de": {
        "settings": "Einstellungen"
    }
}
</i18n>

<template>
    <v-navigation-drawer
        clipped
        fixed
        v-model="drawer"
        app
        mobile-break-point="960"
    >
        <v-layout column fill-height>
            <notebooks />

            <v-spacer />

            <v-list>
                <v-list-tile
                    @click="$router.push({ name: 'settings' })"
                    class="nav-item"
                    :class="getActiveClass($route.name === 'settings')"
                >
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t('settings') }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-layout>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';
    import eventBus from '../../eventBus';

    import Notebooks from './SideNav/Notebooks.vue';

    export default Vue.extend({
        components: {
            Notebooks
        },
        data () {
            return {
                drawer: !this.$vuetify.breakpoint.smAndDown
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        created(): void {
            eventBus.$on('toggleSidebar', this.toggleSidebar);
        },
        methods: {
            toggleSidebar(): void {
                this.drawer = !this.drawer;
            },
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            }
        }
    });
</script>

<style lang="scss" scoped>
    .nav-item {
        &.active {
            background-color: rgba(255, 255, 255, 0.08);
        }

        &.active-light {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
</style>
