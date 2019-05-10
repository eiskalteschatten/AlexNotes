<i18n>
{
    "en": {
        "problemWithGit": "There is a problem connecting to your git repository. Please check your configuration."
    },
    "de": {
        "problemWithGit": "Es gibt ein Problem mit der Verbindung zu Ihrem git-Repository. Bitte Ihre Konfiguration überprüfen."
    }
}
</i18n>

<template>
    <v-app :dark="theme === 'dark'">
        <router-view />
        <about />
        <alert />
        <loader />
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import eventBus from '../eventBus';

    import Alert from './elements/Alert.vue';
    import Loader from './elements/Loader.vue';
    import About from './elements/About.vue';

    export default Vue.extend({
        components: {
            Alert,
            Loader,
            About
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ])
        },
        mounted(): void {
            this.gitPull();
        },
        methods: {
            async gitPull(): Promise<void> {
                const pull = async (): Promise<void> => {
                    try {
                        await this.$http.get('api/git/pull');
                    }
                    catch(error) {
                        console.error(error);
                        eventBus.$emit('show-alert', this.$t('problemWithGit'), true);
                    }
                };

                await pull();
                setInterval(pull, 300000);
            }
        }
    });
</script>

<style lang="scss">

</style>
