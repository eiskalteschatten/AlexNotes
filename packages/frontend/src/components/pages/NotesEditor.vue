<i18n>
{
    "en": {
        "save": "Save",
        "saveAndClose": "Save and Close",
        "close": "Close",
        "title": "Title"
    },
    "de": {
        "save": "Speichern",
        "saveAndClose": "Speichern und schließen",
        "close": "Schließen",
        "title": "Titel"
    }
}
</i18n>

<template>
    <v-layout column fill-height>
        <v-flex shrink>
            <sub-toolbar>
                <div v-if="$vuetify.breakpoint.smAndUp" class="text-xs-right">
                    <v-btn color="success" @click="saveNoteLocal">
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
                </div>
                <div v-else>
                    <v-layout row>
                        <v-btn color="success" @click="saveNoteLocal">
                            <v-icon left>save</v-icon>
                            {{ $t('save') }}
                        </v-btn>

                        <v-flex class="text-xs-right">
                            <v-btn icon @click="closeWithoutSaving">
                                <v-icon>close</v-icon>
                            </v-btn>

                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on">
                                        <v-icon>arrow_drop_down</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-tile>
                                        <v-list-tile-title>
                                            <v-icon left>save</v-icon>
                                            {{ $t('saveAndClose') }}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </div>
            </sub-toolbar>
        </v-flex>
        <v-flex shrink>
            <v-card flat class="pl-3 pr-3 pb-3">
                <v-text-field
                    v-model="inputTitle"
                    :label="$t('title')"
                    required
                    class="mt-0"
                />
            </v-card>
        </v-flex>
        <v-flex grow>
            <editor />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations, mapActions } from 'vuex';

    import Editor from '../elements/Editor.vue';
    import SubToolbar from '../elements/toolbars/SubToolbar.vue';

    export default Vue.extend({
        components: {
            Editor,
            SubToolbar
        },
        computed: {
            ...mapState('notes', [
                'selectedNote'
            ]),
            ...mapState('editor', [
                'additionalFields'
            ]),
            inputTitle: {
                get(): string {
                    return this.additionalFields.title;
                },
                set(title: string): void {
                    this.setAdditionalFields({ title });
                }
            }
        },
        methods: {
            ...mapMutations('editor', [
                'resetToOriginalContent',
                'resetContent',
                'setAdditionalFields'
            ]),
            ...mapActions('notes', [
                'saveNote'
            ]),
            closeWithoutSaving(): void {
                this.$router.push({ name: 'note' });
                this.resetToOriginalContent();
            },
            async saveNoteLocal(): Promise<void> {
                await this.saveNote(this.additionalFields.title);
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
