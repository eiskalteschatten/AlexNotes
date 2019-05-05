<template>
    <footer class="mt-4 text-xs-center">
        <language-switcher />
        <div class="py-3">
            <about />
            <copyright />
        </div>
    </footer>
</template>

<script lang="ts">
    import Vue from 'vue';

    import LanguageSwitcher from '../LanguageSwitcher.vue';
    import About from './elements/About.vue';
    import Copyright from './elements/Copyright.vue';

    export default Vue.extend({
        components: {
            LanguageSwitcher,
            About,
            Copyright
        }
    });
</script>

<style lang="scss" scoped>
</style>
