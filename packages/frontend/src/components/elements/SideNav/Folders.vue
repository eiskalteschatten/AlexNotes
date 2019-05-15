<i18n>
{
    "en": {
        "createFolder": "Create Folder",
        "name": "Name",
        "parentFolder": "Parent Folder",
        "cancel": "Cancel",
        "save": "Save",
        "deleteFolder": "Delete Folder",
        "areYouSureDeleteFolder": "Are you sure you want to delete this folder? All folders and notes within it will be permanently deleted as well.",
        "folderSuccessfullyDeleted": "The folder was successfully deleted.",
        "renameFolder": "Rename Folder",
        "theFolderAlreadyExists": "A folder with that name already exists.",
        "anErrorOccurred": "An error occurred."
    },
    "de": {
        "createFolder": "Ordner erstellen",
        "name": "Name",
        "parentFolder": "Übergeordneter Ordner",
        "cancel": "Abbrechen",
        "save": "Speichern",
        "deleteFolder": "Ordner löschen",
        "areYouSureDeleteFolder": "Sind Sie sicher, dass Sie diesen Ordner löschen möchten? Alle Unterordner und Notizen darin werden auch endgültig gelöscht werden.",
        "folderSuccessfullyDeleted": "Der Ordner wurde erfolgreich gelöscht.",
        "renameFolder": "Ordner umbenennen",
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

                    <v-combobox
                        v-model="newFolderParent"
                        :items="folderTitles"
                        :label="$t('parentFolder')"
                        item-text="title"
                        item-value="id"
                    />
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
                <v-list-tile @click="setRenamingId(contextMenuFolderId)">
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

        <v-layout>
            <v-flex xs2>
                <v-btn class="my-4" flat @click="goBackToNotebooks" icon>
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs10 class="text-xs-center">
                <v-btn class="my-4" @click="newFolderDialog = true">
                    <v-icon left>add</v-icon>
                    {{ $t('createFolder') }}
                </v-btn>
            </v-flex>
        </v-layout>

        <folder-menu-list
            :folders="folders"
            :show-context-menu="showContextMenu"
            :rename-selected-folder="renameSelectedFolder"
            :cancel-rename="cancelRename"
        />

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
    import { RenameFolderValuesInterface, SaveFolderValuesInterface } from '../../../store/folders';
    import { FolderMenuItemInterface } from '../../../../../shared/types/folders';

    import ConfirmDialog from '../ConfirmDialog.vue';
    import FolderMenuList from './Folders/FolderMenuList.vue';

    export default Vue.extend({
        components: {
            ConfirmDialog,
            FolderMenuList
        },
        data() {
            return {
                newFolderDialog: false,
                newFolderName: '',
                newFolderParent: '',
                newFolderIsSaving: false,
                newFolderError: '',
                contextMenuShown: false,
                cmX: 0,
                cmY: 0,
                contextMenuFolderId: '',
                showDeleteFolderConfirmDialog: false
            };
        },
        computed: {
            ...mapState('folders', [
                'folders',
                'renamingId',
                'renamingValue'
            ]),
            ...mapState('notebooks', [
                'selectedNotebookId'
            ]),
            folderTitles(): FolderMenuItemInterface[] {
                return this.getFolderTitles(this.folders);
            }
        },
        watch: {
            async selectedNotebookId(): Promise<void> {
                await this.getFolders();
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
                'setSelectedFolderId',
                'setRenamingId',
                'setRenamingValue'
            ]),
            async saveNewFolder(): Promise<void> {
                this.newFolderIsSaving = true;

                const values: SaveFolderValuesInterface = {
                    title: this.newFolderName,
                    parent: this.newFolderParent.id || this.selectedNotebookId
                };

                const res: ApiReturnObjectInterface = await this.saveFolder(values);

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
            showContextMenu(event: any, id: string, name: string): void {
                event.preventDefault();
                this.contextMenuShown = false;
                this.cancelRename();
                this.cmX = event.clientX;
                this.cmY = event.clientY;
                this.contextMenuFolderId = id;
                this.setRenamingValue(name);
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
                this.setRenamingId('');
                this.setRenamingValue('');
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
            },
            getFolderTitles(folders: FolderMenuItemInterface[]): FolderMenuItemInterface[] {
                let titles: FolderMenuItemInterface[] = [];

                for (const folder of folders) {
                    titles.push({
                        title: folder.title,
                        id: folder.id
                    });

                    if (folder.subfolders && folder.subfolders.length) {
                        const subTitles: FolderMenuItemInterface[] = this.getFolderTitles(folder.subfolders);
                        titles = titles.concat(subTitles);
                    }
                }

                return titles;
            }
        }
    });
</script>

<style lang="scss" scoped>
</style>
