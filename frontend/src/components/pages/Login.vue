<i18n>
{
    "en": {
        "login": "Login",
        "username": "Username",
        "password": "Password",
        "loginVerb": "Log In",
        "required": "Required",
        "incorrectUsernameOrPassword": "Incorrect username or password."
    },
    "de": {
        "login": "Anmeldung",
        "username": "Benutzername",
        "password": "Passwort",
        "loginVerb": "Anmelden",
        "required": "Erforderlich",
        "incorrectUsernameOrPassword": "Falscher Benutzername oder falsches Passwort."
    }
}
</i18n>

<template>
    <v-layout>
        <v-flex xs12 md6 offset-md3>
            <v-card class="mt-5">
                <v-card-title primary-title>
                    <div class="headline">{{ $t('login') }}</div>
                </v-card-title>
                <v-form ref="form" lazy-validation @submit="submit">
                    <v-card-text>
                        <v-alert
                            :value="errorLoggingIn"
                            type="error"
                            class="mb-4"
                        >
                            {{ $t('incorrectUsernameOrPassword') }}
                        </v-alert>

                        <v-text-field
                            :label="$t('username')"
                            data-vv-name="username"
                            :rules="rules"
                            v-model="username"
                            :error="usernameError"
                        />
                        <v-text-field
                            :label="$t('password')"
                            type="password"
                            data-vv-name="password"
                            :rules="rules"
                            v-model="password"
                            :error="passwordError"
                        />
                    </v-card-text>
                    <v-card-actions class="pl-3 pr-3 pb-3">
                        <v-flex xs12 class="text-xs-right">
                            <v-btn
                                primary
                                color="primary"
                                type="submit"
                                :loading="loading"
                                :disabled="loading"
                            >
                                {{ $t('loginVerb') }}
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from 'vue';
    import { mapState, mapActions } from 'vuex';

    export default Vue.extend({
        data() {
            return {
                username: '',
                password: '',
                usernameError: false,
                passwordError: false,
                rules: [
                    value => !!value || this.$t('required')
                ],
                loading: false,
                errorLoggingIn: false
            };
        },
        computed: {
            ...mapState('user', [
                'currentJwt'
            ])
        },
        created() {
            if (this.currentJwt) {
                this.$router.replace({ name: 'home' });
            }
        },
        methods: {
            ...mapActions('user', [
                'fetchJwt'
            ]),
            async submit(event) {
                event.preventDefault();

                if (!this.username) {
                    this.usernameError = true;
                    return;
                }

                if (!this.password) {
                    this.passwordError = true;
                    return;
                }

                this.loading = true;
                const loggedIn = await this.fetchJwt({
                    username: this.username,
                    password: this.password
                });
                this.loading = false;

                if (loggedIn) {
                    this.$router.replace({ name: 'home' });
                }
                else {
                    this.errorLoggingIn = true;
                }
            }
        }
    });
</script>

<style lang="scss">

</style>
