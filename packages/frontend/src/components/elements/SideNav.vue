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
            <div class="notebooks-folders-container">
                <notebooks class="notebooks" ref="notebooks" />
                <folders class="folders" ref="folders" />
            </div>

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
    import Folders from './SideNav/Folders.vue';

    export default Vue.extend({
        components: {
            Notebooks,
            Folders
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
            eventBus.$on('openFolders', this.openFolders);
            eventBus.$on('openNotebooks', this.openNotebooks);
        },
        methods: {
            toggleSidebar(): void {
                this.drawer = !this.drawer;
            },
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            openFolders(): void {
                this.$refs.notebooks.$el.style.left = '-100%';
                this.$refs.folders.$el.style.left = '0';
            },
            openNotebooks(): void {
                this.$refs.notebooks.$el.style.left = '0';
                this.$refs.folders.$el.style.left = '100%';
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

    .notebooks-folders-container {
        width: 100%;

        .notebooks, .folders {
            position: absolute;
            top: 0;
            transition: 250ms left;
            width: 100%;
        }

        .notebooks {
            left: 0;
        }

        .folders {
            left: 100%;
        }
    }

</style>
