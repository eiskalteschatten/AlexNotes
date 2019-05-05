<template>
    <v-toolbar dark color="secondary" class="toolbar" app>
        <v-flex xs12 class="text-xs-center">
            <!-- <img src="images/white-icon.svg" class="main-icon"> -->
        </v-flex>
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
