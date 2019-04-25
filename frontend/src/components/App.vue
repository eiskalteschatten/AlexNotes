<template>
    <v-app :dark="theme === 'dark'">
        <router-view />
        <about />
        <alert />
        <loader />
    </v-app>
</template>

<script>
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import Alert from './elements/Alert.vue';
    import Loader from './elements/Loader.vue';
    import About from './elements/About.vue';

    export default Vue.extend({
        components: {
            Alert,
            Loader,
            About
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ])
        }
    });
</script>

<style lang="scss">

</style>
