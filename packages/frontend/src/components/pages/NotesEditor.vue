<i18n>
{
    "en": {
        "save": "Save",
        "saveAndClose": "Save and Close",
        "close": "Close",
        "title": "Title",
        "areYouSureUnsavedChanges": "Are you sure you want to leave? There are still unsaved changes.",
        "titleIsRequired": "A title is required.",
        "deleteNote": "Delete Note"
    },
    "de": {
        "save": "Speichern",
        "saveAndClose": "Speichern und schließen",
        "close": "Schließen",
        "title": "Titel",
        "areYouSureUnsavedChanges": "Sind Sie sicher, dass Sie diese Seite verlassen möchten? Es gibt noch ungespeicherte Änderungen.",
        "titleIsRequired": "Ein Titel ist erforderlich.",
        "deleteNote": "Notiz löschen"
    }
}
</i18n>

<template>
    <v-layout column fill-height>
        <v-flex shrink>
            <sub-toolbar>
                <div v-if="$vuetify.breakpoint.smAndUp" class="text-xs-right">
                    <v-btn icon @click="deleteNote">
                        <v-icon>delete</v-icon>
                    </v-btn>

                    <v-btn color="success" @click="saveNoteLocal">
                        <v-icon left>save</v-icon>
                        {{ $t('save') }}
                    </v-btn>

                    <v-btn @click="saveAndCloseNote">
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
                                        <v-list-tile-title @click="saveAndCloseNote">
                                            <v-icon left>save</v-icon>
                                            {{ $t('saveAndClose') }}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile>
                                        <v-list-tile-title @click="deleteNote">
                                            <v-icon left>delete</v-icon>
                                            {{ $t('deleteNote') }}
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
                    :error-messages="titleErrorMessage"
                />
            </v-card>
        </v-flex>
        <v-flex grow>
            <editor />
            <confirm-dialog
                :show="showLeaveConfirmDialog"
                :cancel-function="() => showLeaveConfirmDialog = false"
                :confirm-function="leavePageNoPrompt"
                :confirm-question="$t('areYouSureUnsavedChanges')"
                button-color="error"
            />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations, mapActions } from 'vuex';

    import eventBus from '../../eventBus';

    import Editor from '../elements/Editor.vue';
    import SubToolbar from '../elements/toolbars/SubToolbar.vue';
    import ConfirmDialog from '../elements/ConfirmDialog.vue';

    export default Vue.extend({
        components: {
            Editor,
            SubToolbar,
            ConfirmDialog
        },
        data() {
            return {
                showLeaveConfirmDialog: false,
                leavePageTo: '',
                titleErrorMessage: ''
            };
        },
        computed: {
            ...mapState('notes', [
                'selectedNote'
            ]),
            ...mapState('editor', [
                'content',
                'originalContent',
                'additionalFields'
            ]),
            inputTitle: {
                get(): string {
                    return this.additionalFields.title;
                },
                set(title: string): void {
                    this.setAdditionalFields({ title });
                    this.setTitleErrorMessage();
                }
            }
        },
        beforeRouteLeave(to, from, next): void {
            if (this.content !== this.originalContent) {
                this.showLeaveConfirmDialog = true;
                this.leavePageTo = to;
                next(false);
            }
            else {
                next();
                this.resetToOriginalContent();
            }
        },
        methods: {
            ...mapMutations('editor', [
                'resetToOriginalContent',
                'resetContent',
                'setAdditionalFields',
                'updateOriginalContent'
            ]),
            ...mapActions('notes', [
                'saveNote'
            ]),
            closeWithoutSaving(): void {
                this.$router.push({ name: 'note' });
            },
            async saveNoteLocal(): Promise<boolean> {
                this.setTitleErrorMessage();

                if (this.additionalFields.title) {
                    await this.saveNote(this.additionalFields.title);
                    this.updateOriginalContent();
                    return true;
                }

                return false;
            },
            async saveAndCloseNote(): Promise<void> {
                const saved: boolean = await this.saveNoteLocal();

                if (saved) {
                    this.$router.push({ name: 'note' });
                }
            },
            deleteNote(): void {
                eventBus.$emit('delete-note');
            },
            leavePageNoPrompt(): void {
                this.showLeaveConfirmDialog = false;
                this.resetToOriginalContent();
                this.$router.push(this.leavePageTo);
            },
            setTitleErrorMessage(): void {
                this.titleErrorMessage = this.additionalFields.title ? '' : this.$t('titleIsRequired');
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
