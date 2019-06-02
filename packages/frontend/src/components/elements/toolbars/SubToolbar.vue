<template>
    <v-card flat class="pt-3 subtoolbar">
        <slot />
    </v-card>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
    });
</script>

<style lang="scss" scoped>
    .subtoolbar {
        height: 80px;
        overflow: auto;
    }
</style>
