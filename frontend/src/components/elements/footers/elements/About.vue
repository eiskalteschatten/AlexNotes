<i18n>
{
    "en": {
        "about": "About AlexNotes"
    },
    "de": {
        "about": "Über AlexNotes"
    }
}
</i18n>

<template>
    <span>
        <a href="#" @click="openAboutDialog" class="about-link">{{ $t('about') }}</a>
    </span>
</template>

<script>
    import Vue from 'vue';
    import eventBus from '../../../../eventBus';

    export default Vue.extend({
        methods: {
            openAboutDialog(event) {
                event.preventDefault();
                eventBus.$emit('open-modal', 'about');
            }
        }
    });
</script>

<style lang="scss" scoped>
    .about-link {
        border-right: 1px solid #c0c0c0;
        padding-right: 5px;
        margin-right: 5px;
    }

    .electron {
        .about-link {
            display: none;
        }
    }
</style>
