<i18n>
{
    "en": {
        "createFolder": "Create Folder",
        "name": "Name",
        "cancel": "Cancel",
        "save": "Save",
        "deleteFolder": "Delete Folder",
        "areYouSureDeleteFolder": "Are you sure you want to delete this folder? All folders and notes within it will be permanently deleted as well.",
        "folderSuccessfullyDeleted": "The folder was successfully deleted.",
        "renameFolder": "Rename Folder",
        "backToNotebooks": "Back to Notebooks",
        "theFolderAlreadyExists": "A folder with that name already exists.",
        "anErrorOccurred": "An error occurred."
    },
    "de": {
        "createFolder": "Ordner erstellen",
        "name": "Name",
        "cancel": "Abbrechen",
        "save": "Speichern",
        "deleteFolder": "Ordner löschen",
        "areYouSureDeleteFolder": "Sind Sie sicher, dass Sie diesen Ordner löschen möchten? Alle Unterordner und Notizen darin werden auch endgültig gelöscht werden.",
        "folderSuccessfullyDeleted": "Der Ordner wurde erfolgreich gelöscht.",
        "renameFolder": "Ordner umbenennen",
        "backToNotebooks": "Zurück zu den Notizbüchern",
        "theFolderAlreadyExists": "Ein Ordner mit diesem Namen existiert bereits.",
        "anErrorOccurred": "Ein Fehler ist aufgetreten."
    }
}
</i18n>

<template>
    <div>
        <v-dialog v-model="newFolderDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">{{ $t('createFolder') }}</v-card-title>

                <v-card-text>
                    <v-alert :value="newFolderError" type="error" class="mb-4">
                        {{ newFolderError }}
                    </v-alert>
                    <v-text-field :label="`${$t('name')}*`" required v-model="newFolderName" />
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn flat="flat" @click="closeNewFolderDialog">
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn color="success" @click="saveNewFolder" :loading="newFolderIsSaving">
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
                <v-list-tile @click="renamingId = contextMenuFolderId">
                    <v-list-tile-action>
                        <v-icon>edit</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t('renameFolder') }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-divider />

                <v-list-tile @click="showDeleteFolderConfirmDialog = true">
                    <v-list-tile-action>
                        <v-icon>delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ $t('deleteFolder') }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-menu>

        <div class="text-xs-center">
            <v-btn class="ma-4" flat @click="goBackToNotebooks">
                <v-icon left>arrow_back</v-icon>
                {{ $t('backToNotebooks') }}
            </v-btn>
        </div>

        <v-divider />

        <v-list>
            <folder-menu-item
                v-for="folder in folders"
                :key="folder.id"
                :folder="folder"
                :renaming-id="renamingId"
                :depth="0"
                @click.native="selectFolder(folder.id)"
                @contextmenu.native="showContextMenu($event, folder.id, folder.title)"
            />
        </v-list>

        <confirm-dialog
            :show="showDeleteFolderConfirmDialog"
            :cancel-function="() => showDeleteFolderConfirmDialog = false"
            :confirm-function="deleteSelectedFolder"
            :confirm-question="$t('areYouSureDeleteFolder')"
            button-color="error"
        />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapActions, mapMutations } from 'vuex';

    import eventBus from '../../../eventBus';

    import { ApiReturnObjectInterface } from '../../../types/apiReturnObject';
    import { RenameFolderValuesInterface } from '../../../store/folders';

    import ConfirmDialog from '../ConfirmDialog.vue';
    import FolderMenuItem from './Folders/FolderMenuItem.vue';

    export default Vue.extend({
        components: {
            ConfirmDialog,
            FolderMenuItem
        },
        data() {
            return {
                newFolderDialog: false,
                newFolderName: '',
                newFolderIsSaving: false,
                newFolderError: '',
                contextMenuShown: false,
                cmX: 0,
                cmY: 0,
                contextMenuFolderId: '',
                showDeleteFolderConfirmDialog: false,
                renamingId: '',
                renamingValue: ''
            };
        },
        computed: {
            ...mapState('folders', [
                'folders'
            ]),
            ...mapState('notebooks', [
                'selectedNotebookId'
            ])
        },
        watch: {
            async selectedNotebookId(newId: string): Promise<void> {
                await this.getFolders(newId);
            }
        },
        methods: {
            ...mapActions('folders', [
                'getFolders',
                'saveFolder',
                'deleteFolder',
                'renameFolder'
            ]),
            ...mapMutations('folders', [
                'setSelectedFolderId'
            ]),
            async saveNewFolder(): Promise<void> {
                this.newFolderIsSaving = true;

                const res: ApiReturnObjectInterface = await this.saveFolder(this.newFolderName);

                if (res.code >= 400) {
                    this.newFolderError = this.$t(res.message);
                    this.newFolderIsSaving = false;
                    return;
                }

                this.setSelectedFolderId(res.body.id);
                this.closeNewFolderDialog();
            },
            closeNewFolderDialog(): void {
                this.newFolderName = '';
                this.newFolderError = '';
                this.newFolderDialog = false;
                this.newFolderIsSaving = false;
            },
            selectFolder(id: string): void {
                this.setSelectedFolderId(id);
            },
            showContextMenu(event: any, id: string, name: string): void {
                event.preventDefault();
                this.contextMenuShown = false;
                this.cancelRename();
                this.cmX = event.clientX;
                this.cmY = event.clientY;
                this.contextMenuFolderId = id;
                this.renamingValue = name;
                this.$nextTick(() => this.contextMenuShown = true);
            },
            async renameSelectedFolder(): Promise<void> {
                const values: RenameFolderValuesInterface = {
                    id: this.renamingId,
                    newName: this.renamingValue
                };

                const res: ApiReturnObjectInterface = await this.renameFolder(values);

                if (res.code >= 400) {
                    eventBus.$emit('show-alert', this.$t(res.message), true);
                }

                this.cancelRename();
            },
            cancelRename(): void {
                this.renamingId = '';
                this.renamingValue = '';
            },
            async deleteSelectedFolder(): Promise<void> {
                this.showDeleteFolderConfirmDialog = false;

                const res: ApiReturnObjectInterface = await this.deleteFolder(this.contextMenuFolderId);

                if (res.code >= 400) {
                    eventBus.$emit('show-alert', this.$t(res.message), true);
                    return;
                }

                eventBus.$emit('show-alert', this.$t('folderSuccessfullyDeleted'));
            },
            goBackToNotebooks(): void {
                eventBus.$emit('openNotebooks');
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
