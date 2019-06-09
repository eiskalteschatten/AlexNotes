<i18n>
{
    "en": {
        "backToNotes": "Back to Notes"
    },
    "de": {
        "backToNotes": "Zurück zu den Notizen"
    }
}
</i18n>

<template>
    <v-flex fill-height pa-4>
        <v-btn
            fixed
            dark
            fab
            bottom
            right
            color="secondary"
            :small="$vuetify.breakpoint.smAndDown"
            @click="$router.push({ name: 'editNote' })"
        >
            <v-icon style="height: auto;">edit</v-icon>
        </v-btn>

        <div class="mb-4" v-if="$vuetify.breakpoint.smAndDown">
            <v-btn @click="mobileGoBackToMiddleView">
                <v-icon left>arrow_back</v-icon>
                {{ $t('backToNotes') }}
            </v-btn>
        </div>

        <h1 v-if="title">{{ title }}</h1>
        <div v-html="renderedHtml" />
    </v-flex>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import eventBus from '../../eventBus';

    export default Vue.extend({
        computed: {
            ...mapState('markdownViewer', [
                'title',
                'renderedHtml'
            ])
        },
        methods: {
            mobileGoBackToMiddleView(): void {
                eventBus.$emit('mobile-go-back-to-middle-view');
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
