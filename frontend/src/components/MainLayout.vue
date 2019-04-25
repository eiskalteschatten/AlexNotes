<template>
    <div>
        <side-nav />
        <toolbar />
        <v-content>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-content>
        <bottom-nav />
    </div>
</template>

<script>
    import Vue from 'vue';

    import Toolbar from './elements/toolbars/Main.vue';
    import SideNav from './elements/SideNav.vue';
    import BottomNav from './elements/BottomNav.vue';

    export default Vue.extend({
        components: {
            Toolbar,
            SideNav,
            BottomNav
        }
    });
</script>

<style lang="scss">

</style>
