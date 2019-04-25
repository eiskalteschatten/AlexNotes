<i18n>
{
    "en": {
        "alexseifertWebsite": "https://www.alexseifert.com"
    },
    "de": {
        "alexseifertWebsite": "https://www.alexseifert.de"
    }
}
</i18n>

<template>
    <span>
        &copy; {{ copyrightYear }} <external-link :href="$t('alexseifertWebsite')" link-content="Alex Seifert" />
    </span>
</template>

<script>
    import Vue from 'vue';

    import ExternalLink from '../../ExternalLink.vue';

    export default Vue.extend({
        components: {
            ExternalLink
        },
        computed: {
            copyrightYear() {
                const year = new Date().getFullYear();
                return year === 2019 ? year : `2019 - ${year}`;
            }
        }
    });
</script>

<style lang="scss" scoped>
</style>
