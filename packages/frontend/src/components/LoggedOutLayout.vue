<template>
    <div>
        <toolbar />
        <v-content>
            <router-view />
        </v-content>
        <main-footer />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    import Toolbar from './elements/toolbars/LoggedOut.vue';
    import MainFooter from './elements/footers/LoggedOut.vue';

    export default Vue.extend({
        components: {
            Toolbar,
            MainFooter
        }
    });
</script>

<style lang="scss">

</style>
