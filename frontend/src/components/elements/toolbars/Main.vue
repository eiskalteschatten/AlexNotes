<i18n>
{
    "en": {
        "accountSettings": "Account Settings",
        "about": "About AlexNotes",
        "logout": "Logout"
    },
    "de": {
        "accountSettings": "Kontoeinstellungen",
        "about": "Über AlexNotes",
        "logout": "Abmeldung"
    }
}
</i18n>

<template>
    <v-toolbar dark color="secondary" class="toolbar" app clipped-left>
        <v-flex xs5>
            <v-toolbar-side-icon v-if="$vuetify.breakpoint.smAndDown" @click="toggleSidebar" />
        </v-flex>
        <v-flex xs2 class="text-xs-center">
            <!-- <img src="images/white-icon.svg" class="main-icon"> -->
        </v-flex>
        <v-flex xs5 class="text-xs-right">
            <v-menu left :nudge-bottom="40">
                <v-btn slot="activator" dark icon>
                    <v-icon>account_circle</v-icon>
                </v-btn>

                <v-list>
                    <v-list-tile disabled>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ fullName }} ({{ userInfo.username }})</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="$router.push({ name: 'accountSettings' })">
                        <v-list-tile-action>
                            <v-icon>person</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ $t('accountSettings') }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="openAboutDialog">
                        <v-list-tile-action>
                            <v-icon>info</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ $t('about') }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider />

                    <v-list-tile @click="logout">
                        <v-list-tile-action>
                            <v-icon>exit_to_app</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ $t('logout') }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-flex>
    </v-toolbar>
</template>

<script>
    import Vue from 'vue';
    import { mapState, mapActions } from 'vuex';
    import eventBus from '../../../eventBus';

    export default Vue.extend({
        computed: {
            ...mapState('user', {
                userInfo: 'info'
            }),
            fullName() {
                return this.userInfo.firstName + ' ' + this.userInfo.lastName;
            }
        },
        methods: {
            ...mapActions('user', [
                'removeJwt'
            ]),
            async logout() {
                await this.removeJwt();
                this.$router.replace({ name: 'login' });
            },
            toggleSidebar() {
                eventBus.$emit('toggleSidebar');
            },
            openAboutDialog() {
                eventBus.$emit('open-modal', 'about');
            }
        }
    });
</script>

<style lang="scss" scoped>
    .main-icon {
        height: 30px;
    }

    .electron {
        &.darwin {
            .toolbar {
                padding-top: 10px;
                -webkit-app-region: drag;
                -webkit-user-select: none;
            }
        }
    }
</style>
