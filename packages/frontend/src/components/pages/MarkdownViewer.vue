<template>
    <div>
        <span v-html="renderedHtml" />
    </div>
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
