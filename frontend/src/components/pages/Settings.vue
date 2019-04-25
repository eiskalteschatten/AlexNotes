<i18n>
{
    "en": {
        "settings": "Settings",
        "theme": "Theme",
        "light": "Light",
        "dark": "Dark",
        "language": "Language",
        "serverSettings": "Server Settings",
        "host": "Host",
        "save": "Save",
        "required": "Required",
        "allFieldsRequired": "Please fill out all fields!",
        "couldNotConnectToServer": "There was an error connecting to the server.",
        "changesSaved": "Your changes were successfully saved."
    },
    "de": {
        "settings": "Einstellungen",
        "theme": "Erscheinungsbild",
        "light": "Hell",
        "dark": "Dunkel",
        "language": "Sprache",
        "serverSettings": "Servereinstellungen",
        "host": "Host",
        "save": "Speichern",
        "required": "Erforderlich",
        "allFieldsRequired": "Bitte alle Felder ausfüllen!",
        "couldNotConnectToServer": "Die Serververbindung ist fehlgeschlagen.",
        "changesSaved": "Ihre Änderungen wurden erfolgreich gespeichert."
    }
}
</i18n>

<template>
    <centered-column>
        <v-card class="pa-2 mb-5">
            <v-card-title primary-title>
                <h1>{{ $t('settings') }}</h1>
            </v-card-title>
            <v-card-text>
                <div class="mb-5">
                    <h3>{{ $t('theme') }}</h3>

                    <div class="preferences-theme mt-3 mr-5" @click="setTheme('light')">
                        <div class="theme-image light" :class="{ 'selected': theme === 'light' }">
                            <div class="gradient" />
                        </div>
                        {{ $t('light') }}
                    </div>
                    <div class="preferences-theme" @click="setTheme('dark')">
                        <div class="theme-image dark" :class="{ 'selected': theme === 'dark' }">
                            <div class="gradient" />
                        </div>
                        {{ $t('dark') }}
                    </div>
                </div>

                <div class="mb-5">
                    <h3 class="mb-3">{{ $t('language') }}</h3>
                    <language-switcher />
                </div>
            </v-card-text>
        </v-card>

        <v-card class="pa-2 mb-5" v-if="isElectron">
            <v-card-title primary-title>
                <h3>{{ $t('serverSettings') }}</h3>
            </v-card-title>
            <v-form ref="form" lazy-validation @submit="submitServer">
                <v-card-text>
                    <v-alert
                        :value="serverAlert"
                        type="error"
                        class="mb-4"
                    >
                        {{ $t(serverAlertMessage) }}
                    </v-alert>
                    <v-text-field
                        :label="$t('host')"
                        data-vv-name="serverHost"
                        :rules="rules"
                        v-model="serverHost"
                        placeholder="https://www.your-server.com:3021"
                        :error="errors.serverHost"
                    />
                </v-card-text>
                <v-card-actions class="pl-3 pr-3 pb-3">
                    <v-flex xs12 class="text-xs-right">
                        <v-btn
                            primary
                            color="primary"
                            type="submit"
                            :loading="serverLoading"
                            :disabled="serverLoading"
                        >
                            <v-icon left>save</v-icon>
                            {{ $t('save') }}
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-form>
        </v-card>
    </centered-column>
</template>

<script>
    import Vue from 'vue';
    import { mapState, mapActions } from 'vuex';
    import { setRoot } from '../../http';
    import eventBus from '../../eventBus';

    import CenteredColumn from '../elements/layout/CenteredColumn.vue';
    import LanguageSwitcher from '../elements/LanguageSwitcher.vue';

    export default Vue.extend({
        components: {
            CenteredColumn,
            LanguageSwitcher
        },
        data() {
            return {
                isElectron: localStorage.getItem('isElectron'),
                errors: {},
                rules: [
                    value => !!value || this.$t('required')
                ],
                serverHost: localStorage.getItem('serverConfigHost'),
                serverLoading: false,
                serverAlert: false,
                serverAlertMessage: ''
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ])
        },
        methods: {
            ...mapActions('settings', [
                'setTheme'
            ]),
            async submitServer(event) {
                event.preventDefault();
                this.serverAlert = false;

                if (!this.serverHost) {
                    this.serverAlertMessage = 'allFieldsRequired';
                    this.serverAlert = true;
                    this.errors.serverHost = true;
                    return;
                }
                else {
                    this.errors.serverHost = false;
                }

                this.loading = true;
                let canConnectToServer = false;

                try {
                    const res = await this.$http.get(`${this.serverHost}/status/is-dev-notebook`);
                    canConnectToServer = res.body === 'true';
                }
                catch(error) {
                    canConnectToServer = false;
                }

                if (canConnectToServer) {
                    localStorage.setItem('serverConfigHost', this.serverHost);
                    setRoot(this.serverHost);
                    eventBus.$emit('show-alert', this.$t('changesSaved'));
                }
                else {
                    this.serverAlertMessage = 'couldNotConnectToServer';
                    this.serverAlert = true;
                }

                this.loading = false;
            }
        }
    });
</script>

<style lang="scss" scoped>
    .preferences-theme {
        cursor: pointer;
        display: inline-block;
        text-align: center;

        .theme-image {
            $borderSize: 2px;
            height: 75px;
            margin-bottom: 10px;
            width: 100%;

            &.light {
                .gradient {
                    background-image: linear-gradient(to right, #000000 10%, #f3f3f3 10%, #f3f3f3 90%);
                }
            }

            &.dark {
                .gradient {
                    background-image: linear-gradient(to right, #000000 10%, #252525 10%, #252525 90%);
                }
            }

            &.selected {
                .gradient {
                    border: $borderSize solid #2261a1;
                }
            }

            .gradient {
                border: $borderSize solid rgba(0, 0, 0, 0.3);
                border-radius: 3px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                height: 100%;
                width: 120px;
            }
        }
    }
</style>
