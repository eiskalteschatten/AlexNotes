<i18n>
{
    "en": {
        "createNotebook": "Create Notebook",
        "name": "Name",
        "cancel": "Cancel",
        "save": "Save",
        "deleteNotebook": "Delete Notebook",
        "areYouSureDeleteNotebook": "Are you sure you want to delete this notebook? All folders and notes within it will be permanently deleted as well.",
        "notebookSuccessfullyDeleted": "The notebook was successfully deleted.",
        "renameNotebook": "Rename Notebook",
        "theFolderAlreadyExists": "A notebook with that name already exists.",
        "anErrorOccurred": "An error occurred."
    },
    "de": {
        "createNotebook": "Notizbuch erstellen",
        "name": "Name",
        "cancel": "Abbrechen",
        "save": "Speichern",
        "deleteNotebook": "Notizbuch löschen",
        "areYouSureDeleteNotebook": "Sind Sie sicher, dass Sie dieses Notizbuch löschen möchten? Alle Ordner und Notizen darin werden auch endgültig gelöscht werden.",
        "notebookSuccessfullyDeleted": "Das Notizbuch wurde erfolgreich gelöscht.",
        "renameNotebook": "Notizbuch umbenennen",
        "theFolderAlreadyExists": "Ein Notizbuch mit diesem Name existiert bereits.",
        "anErrorOccurred": "Ein Fehler ist aufgetreten."
    }
}
</i18n>

<template>
    <div>
        <v-dialog v-model="newNotebookDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">{{ $t('createNotebook') }}</v-card-title>

                <v-card-text>
                    <v-alert :value="newNotebookError" type="error" class="mb-4">
                        {{ newNotebookError }}
                    </v-alert>
                    <v-text-field :label="`${$t('name')}*`" required v-model="newNotebookName" />
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn flat="flat" @click="closeNewNotebookDialog">
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn color="success" @click="saveNewNotebook" :loading="newNotebookIsSaving">
                        {{ $t('save') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-menu
            v-model="contextMenuShown"
            :position-x="cmX"
            :position-y="cmY"
            absolute
            offset-y
        >
            <v-list>
                <v-list-tile @click="renamingId = contextMenuNotebookId">
                    <v-list-tile-action>
                        <v-icon>edit</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t('renameNotebook') }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-divider />

                <v-list-tile @click="showDeleteNotebookConfirmDialog = true">
                    <v-list-tile-action>
                        <v-icon>delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t('deleteNotebook') }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-menu>

        <div class="text-xs-center">
            <v-btn class="ma-4" @click="newNotebookDialog = true">
                <v-icon left>add</v-icon>
                {{ $t('createNotebook') }}
            </v-btn>
        </div>

        <v-list>
            <v-list-tile
                v-for="notebook in notebooks"
                :key="notebook.title"
                @click="selectNotebook(notebook.id)"
                class="nav-item"
                :class="getActiveClass(selectedNotebookId === notebook.id)"
                @contextmenu="showContextMenu($event, notebook.id, notebook.title)"
            >
                <v-list-tile-action>
                    <v-icon>{{ notebook.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-text-field
                        v-if="renamingId === notebook.id"
                        v-model="renamingValue"
                        :ref="`renamingTextField-${notebook.id}`"
                        @blur="renameSelectedNotebook"
                        @keyup.enter.native="renameSelectedNotebook"
                        @keyup.esc.native="cancelRename"
                        autofocus
                    />
                    <v-list-tile-title v-else>{{ notebook.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <confirm-dialog
            :show="showDeleteNotebookConfirmDialog"
            :cancel-function="() => showDeleteNotebookConfirmDialog = false"
            :confirm-function="deleteSelectedNotebook"
            :confirm-question="$t('areYouSureDeleteNotebook')"
            button-color="error"
        />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapActions, mapMutations } from 'vuex';

    import eventBus from '../../../eventBus';

    import { ApiReturnObjectInterface } from '../../../types/apiReturnObject';

    import ConfirmDialog from '../ConfirmDialog.vue';

    export default Vue.extend({
        components: {
            ConfirmDialog
        },
        data() {
            return {
                newNotebookDialog: false,
                newNotebookName: '',
                newNotebookIsSaving: false,
                newNotebookError: '',
                contextMenuShown: false,
                cmX: 0,
                cmY: 0,
                contextMenuNotebookId: '',
                showDeleteNotebookConfirmDialog: false,
                renamingId: '',
                renamingValue: ''
            };
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('notebooks', [
                'notebooks',
                'selectedNotebookId'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        async created(): Promise<void> {
            await this.getNotebooks();
        },
        methods: {
            ...mapActions('notebooks', [
                'getNotebooks',
                'saveNotebook',
                'deleteNotebook'
            ]),
            ...mapMutations('notebooks', [
                'setSelectedNotebookId'
            ]),
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            async saveNewNotebook(): Promise<void> {
                this.newNotebookIsSaving = true;

                const res: ApiReturnObjectInterface = await this.saveNotebook(this.newNotebookName);

                if (res.code >= 400) {
                    this.newNotebookError = this.$t(res.message);
                    this.newNotebookIsSaving = false;
                    return;
                }

                this.setSelectedNotebookId(res.body.id);
                this.closeNewNotebookDialog();
            },
            closeNewNotebookDialog(): void {
                this.newNotebookName = '';
                this.newNotebookError = '';
                this.newNotebookDialog = false;
                this.newNotebookIsSaving = false;
            },
            selectNotebook(id: string): void {
                this.setSelectedNotebookId(id);
            },
            showContextMenu(event: any, id: string, name: string): void {
                event.preventDefault();
                this.contextMenuShown = false;
                this.cmX = event.clientX;
                this.cmY = event.clientY;
                this.contextMenuNotebookId = id;
                this.renamingValue = name;
                this.$nextTick(() => this.contextMenuShown = true);
            },
            async renameSelectedNotebook(): Promise<void> {
                console.log("rename")
                this.renamingId = '';
            },
            cancelRename(): void {
                this.renamingId = '';
                this.renamingValue = '';
            },
            async deleteSelectedNotebook(): Promise<void> {
                this.showDeleteNotebookConfirmDialog = false;

                const res: ApiReturnObjectInterface = await this.deleteNotebook(this.contextMenuNotebookId);

                if (res.code >= 400) {
                    eventBus.$emit('show-alert', this.$t(res.message), true);
                    return;
                }

                eventBus.$emit('show-alert', this.$t('notebookSuccessfullyDeleted'));
            }
        }
    });
</script>

<style lang="scss" scoped>
    .nav-item {
        &.active {
            background-color: rgba(255, 255, 255, 0.08);
        }

        &.active-light {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
</style>
