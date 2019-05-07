<i18n>
{
    "en": {
        "createNotebook": "Create Notebook",
        "settings": "Settings"
    },
    "de": {
        "createNotebook": "Notizbuch erstellen",
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
            <v-btn class="ma-4">
                <v-icon left>add</v-icon>
                {{ $t('createNotebook') }}
            </v-btn>

            <v-list>
                <v-list-tile
                    v-for="notebook in notebooks"
                    :key="notebook.title"
                    @click="$router.push({ name: notebook.routeName })"
                    class="nav-item"
                    :class="getActiveClass($route.name === notebook.routeName)"
                >
                    <v-list-tile-action>
                        <v-icon>{{ notebook.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ notebook.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

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
    import { mapState, mapActions } from 'vuex';
    import eventBus from '../../eventBus';

    export default Vue.extend({
        data () {
            return {
                drawer: !this.$vuetify.breakpoint.smAndDown
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('notebooks', [
                'notebooks'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        async created(): Promise<void> {
            await this.getNotebooks();
            eventBus.$on('toggleSidebar', this.toggleSidebar);
        },
        methods: {
            ...mapActions('notebooks', [
                'getNotebooks'
            ]),
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

    .electron {
        &.darwin {
            .v-navigation-drawer--is-mobile {
                padding-top: 25px;
            }
        }
    }
</style>
