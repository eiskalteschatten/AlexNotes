<i18n>
{
    "en": {
        "pageNotFound": "Page not found",
        "pageNotFoundSentence": "This page could not be found. Please check the URL or try again from the homepage."
    },
    "de": {
        "pageNotFound": "Seite nicht gefunden",
        "pageNotFoundSentence": "Diese Seite konnte nicht gefunden werden. Bitte prüfen Sie die URL oder versuchen Sie noch einmal von der Startseite."
    }
}
</i18n>

<template>
    <v-layout>
        <v-flex xs12 md6 offset-md3>
            <v-card class="mt-5">
                <v-card-title primary-title>
                    <div class="headline">{{ $t('pageNotFound') }}</div>
                </v-card-title>
                <v-card-text>
                    <v-alert
                        :value="true"
                        type="error"
                        class="mb-4"
                    >
                        {{ $t('pageNotFoundSentence') }}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
    });
</script>

<style lang="scss">

</style>
