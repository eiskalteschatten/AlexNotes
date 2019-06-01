<template>
    <v-list>
        <div v-for="folder in folders" :key="folder.id">
            <v-list-group
                v-if="folder.subfolders && folder.subfolders.length"
                v-model="folder.active"
                no-action
            >
                <template v-slot:activator>
                    <v-list-tile
                        @click="selectFolder(folder.id)"
                        @contextmenu="showContextMenu($event, folder.id, folder.title)"
                        class="nav-item"
                        :class="getActiveClass(selectedFolderId === folder.id)"
                    >
                        <v-list-tile-content>
                            <v-text-field
                                v-if="renamingId === folder.id"
                                v-model="computedRenamingValue"
                                :ref="`renamingTextField-${folder.id}`"
                                @blur="renameSelectedFolder"
                                @keyup.enter.native="renameSelectedFolder"
                                @keyup.esc.native="cancelRename"
                                autofocus
                            />
                            <v-list-tile-title v-else>{{ folder.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>

                <folder-menu-list
                    :folders="folder.subfolders"
                    :show-context-menu="showContextMenu"
                    :rename-selected-folder="renameSelectedFolder"
                    :cancel-rename="cancelRename"
                />
            </v-list-group>

            <v-list-tile
                v-else
                @click="selectFolder(folder.id)"
                @contextmenu="showContextMenu($event, folder.id, folder.title)"
                class="nav-item"
                :class="getActiveClass(selectedFolderId === folder.id)"
                ripple
            >
                <v-list-tile-content>
                    <v-text-field
                        v-if="renamingId === folder.id"
                        v-model="computedRenamingValue"
                        :ref="`renamingTextField-${folder.id}`"
                        @blur="renameSelectedFolder"
                        @keyup.enter.native="renameSelectedFolder"
                        @keyup.esc.native="cancelRename"
                        autofocus
                    />
                    <v-list-tile-title v-else>{{ folder.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </div>
    </v-list>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

    import eventBus from '../../../../eventBus';

    import { SelectEvent } from '../../../../types/selectEvent';

    export default Vue.extend({
        components: {
            FolderMenuList: () => import('./FolderMenuList.vue')
        },
        props: {
            folders: Array,
            showContextMenu: Function,
            renameSelectedFolder: Function,
            cancelRename: Function
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('folders', [
                'selectedFolderId',
                'renamingId',
                'renamingValue'
            ]),
            ...mapState('notebooks', [
                'selectedNotebookId'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            },
            computedRenamingValue: {
                get(): string {
                    return this.renamingValue;
                },
                set(value: string): void {
                    this.setRenamingValue(value);
                }
            }
        },
        created(): void {
            eventBus.$on('selectFolder', async (params: SelectEvent): Promise<void> => {
                if (this.selectedNotebookId && params.id) {
                    const folderId = `${this.selectedNotebookId}/${params.id}`;
                    await this.selectFolder(folderId, false);
                    await params.callback();
                }
            });
        },
        methods: {
            ...mapMutations('folders', [
                'setSelectedFolderId',
                'setRenamingValue'
            ]),
            ...mapGetters('folders', [
                'getFolderIdNoNotebook'
            ]),
            ...mapActions('notes', [
                'getNotes'
            ]),
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            async selectFolder(id: string, push: boolean = true): Promise<void> {
                this.setSelectedFolderId(id);
                const folder: string = this.getFolderIdNoNotebook();
                await this.getNotes();

                if (push) {
                    this.$router.push({ name: 'folder', params: { folder } });
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
    .nav-item {
        cursor: pointer;

        &.active {
            background-color: rgba(255, 255, 255, 0.08);
        }

        &.active-light {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
</style>
