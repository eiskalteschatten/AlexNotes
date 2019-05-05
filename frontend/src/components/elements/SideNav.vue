<i18n>
{
    "en": {
        "showSidebar": "Show Sidebar",
        "hideSidebar": "Hide Sidebar",
        "dashboard": "Dashboard",
        "clients": "Clients",
        "categories": "Categories",
        "projects": "Projects",
        "settings": "Settings"
    },
    "de": {
        "showSidebar": "Seitenleist ausklappen",
        "hideSidebar": "Seitenleiste einklappen",
        "dashboard": "Dashboard",
        "clients": "Kunden",
        "categories": "Kategorien",
        "projects": "Projekte",
        "settings": "Einstellungen"
    }
}
</i18n>

<template>
    <v-navigation-drawer
        clipped
        fixed
        :mini-variant="mini"
        v-model="drawer"
        app
        dark
        mobile-break-point="960"
    >
        <v-layout column fill-height>
            <v-list>
                <v-list-tile
                    v-for="item in items"
                    :key="item.title"
                    @click="$router.push({ name: item.routeName })"
                    class="nav-item"
                    :class="{ 'active': $route.name === item.routeName }"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

            <v-spacer />

            <v-list>
                <v-list-tile @click="toggleMini" v-if="$vuetify.breakpoint.mdAndUp">
                    <v-list-tile-action>
                        <v-icon>{{ toggleIcon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ toggleLabel }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-divider />

                <v-list-tile
                    @click="$router.push({ name: 'settings' })"
                    class="nav-item"
                    :class="{ 'active': $route.name === 'settings' }"
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
    import eventBus from '../../eventBus';

    export default Vue.extend({
        data () {
            return {
                drawer: !this.$vuetify.breakpoint.smAndDown,
                items: [
                    { title: 'dashboard', icon: 'dashboard', routeName: 'home' },
                    { title: 'clients', icon: 'people', routeName: 'clients' },
                    { title: 'projects', icon: 'library_books', routeName: 'projects' },
                    { title: 'categories', icon: 'category', routeName: 'categories' }
                ],
                miniData: true
            };
        },
        computed: {
            toggleIcon(): string {
                return this.mini ? 'chevron_right' : 'chevron_left';
            },
            toggleLabel(): string {
                return this.mini ? this.$t('showSidebar') : this.$t('hideSidebar');
            },
            mini: {
                get(): boolean {
                    return this.$vuetify.breakpoint.smAndDown ? false : this.miniData;
                },
                set(mini: boolean): void {
                    this.miniData = mini;
                }
            }
        },
        created() {
            eventBus.$on('toggleSidebar', this.toggleSidebar);
        },
        methods: {
            toggleMini(): void {
                this.mini = !this.mini;
            },
            toggleSidebar(): void {
                this.drawer = !this.drawer;
            }
        }
    });
</script>

<style lang="scss" scoped>
    .nav-item {
        &.active {
            background-color: rgba(255, 255, 255, 0.08);
            border-left: 3px solid #ffffff;
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
