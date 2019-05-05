<template>
    <h1 class="mb-4">
        <v-icon class="title-icon mr-2" v-if="icon">
            {{ icon }}
        </v-icon>

        {{ title }}
    </h1>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            title: String,
            icon: String
        }
    });
</script>

<style lang="scss" scoped>
    .title-icon {
        font-size: 1em;
    }
</style>
