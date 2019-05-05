<template>
    <v-toolbar color="primary" class="toolbar" app>
        <v-toolbar-title class="white--text">
            AlexNotes
        </v-toolbar-title>
    </v-toolbar>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
    });
</script>

<style lang="scss" scoped>
    .main-icon {
        height: 30px;
    }

    .electron {
        &.darwin {
            .toolbar {
                padding-top: 10px;
                -webkit-app-region: drag;
                -webkit-user-select: none;
            }
        }
    }
</style>
