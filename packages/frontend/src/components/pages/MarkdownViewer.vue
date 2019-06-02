<template>
    <v-flex fill-height>
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

        <div v-html="renderedHtml" />
    </v-flex>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    export default Vue.extend({
        computed: {
            ...mapState('markdownViewer', [
                'renderedHtml'
            ])
        }
    });
</script>

<style lang="scss" scoped>

</style>
