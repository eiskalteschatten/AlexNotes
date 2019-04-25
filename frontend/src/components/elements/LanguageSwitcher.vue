<i18n>
{
    "en": {
        "chooseLanguage": "Choose Language"
    },
    "de": {
        "chooseLanguage": "Sprache auswählen"
    }
}
</i18n>

<template>
    <v-menu offset-y>
        <v-btn flat slot="activator">
            {{ $t('chooseLanguage') }}
            <v-icon dark>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
            <v-list-tile
                v-for="(language, index) in languages"
                :key="index"
                @click="switchLanguages(language.code)"
            >
                <v-list-tile-title>{{ language.title }}</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script>
    import Vue from 'vue';
    import { mapState } from 'vuex';

    export default Vue.extend({
        computed: {
            ...mapState('settings', [
                'languages'
            ])
        },
        methods: {
            switchLanguages(lang) {
                this.$router.push({ params: { lang } });
            }
        }
    });
</script>

<style lang="scss" scoped>
</style>
