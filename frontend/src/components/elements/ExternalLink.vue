<template>
    <a :href="href" :target="target">
        {{ linkContent }}
    </a>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            href: String,
            target: {
                type: [String, Boolean],
                default: '_blank'
            },
            linkContent: String
        }
    });
</script>

<style lang="scss" scoped>
</style>
