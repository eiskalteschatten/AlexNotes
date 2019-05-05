<i18n>
{
    "en": {
        "dashboard": "Dashboard"
    },
    "de": {
        "dashboard": "Dashboard"
    }
}
</i18n>

<template>
    <div>
        <page-title :title="$t('dashboard')" icon="dashboard" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    import PageTitle from '../elements/PageTitle.vue';

    export default Vue.extend({
        components: {
            PageTitle
        }
    });
</script>

<style lang="scss" scoped>

</style>
