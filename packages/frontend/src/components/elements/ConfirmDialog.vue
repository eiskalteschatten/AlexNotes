<i18n>
{
    "en": {
        "no": "No",
        "yes": "Yes"
    },
    "de": {
        "no": "Nein",
        "yes": "Ja"
    }
}
</i18n>

<template>
    <v-dialog v-model="show" max-width="400">
        <v-card>
            <v-card-text>
                {{ confirmQuestion }}
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn flat="flat" @click="cancelFunction">
                    {{ $t('no') }}
                </v-btn>

                <v-btn :color="buttonColor" @click="confirmFunction">
                    {{ $t('yes') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            show: Boolean,
            cancelFunction: Function,
            confirmFunction: Function,
            confirmQuestion: String,
            buttonColor: {
                type: String,
                default: 'success'
            }
        }
    });
</script>

<style lang="scss">

</style>
