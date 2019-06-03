<i18n>
{
    "en": {
        "save": "Save",
        "saveAndClose": "Save and Close",
        "close": "Close"
    },
    "de": {
        "save": "Speichern",
        "saveAndClose": "Speichern und schließen",
        "close": "Schließen"
    }
}
</i18n>

<template>
    <v-layout column fill-height>
        <v-flex shrink>
            <sub-toolbar class="text-xs-right">
                <v-btn color="success">
                    <v-icon left>save</v-icon>
                    {{ $t('save') }}
                </v-btn>

                <v-btn>
                    <v-icon left>save</v-icon>
                    {{ $t('saveAndClose') }}
                </v-btn>

                <v-btn color="error" @click="closeWithoutSaving">
                    <v-icon left>close</v-icon>
                    {{ $t('close') }}
                </v-btn>
            </sub-toolbar>
        </v-flex>
        <v-flex grow>
            <editor />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations } from 'vuex';

    import Editor from '../elements/Editor.vue';
    import SubToolbar from '../elements/toolbars/SubToolbar.vue';

    export default Vue.extend({
        components: {
            Editor,
            SubToolbar
        },
        methods: {
            ...mapMutations('editor', [
                'resetContent'
            ]),
            closeWithoutSaving(): void {
                this.$router.push({ name: 'note' });
                this.resetContent();
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
