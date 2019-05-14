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
                                v-model="renamingValue"
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
            >
                <v-list-tile-content>
                    <v-text-field
                        v-if="renamingId === folder.id"
                        v-model="renamingValue"
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
    import { mapState, mapMutations } from 'vuex';

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
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        methods: {
            ...mapMutations('folders', [
                'setSelectedFolderId'
            ]),
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            selectFolder(id: string): void {
                this.setSelectedFolderId(id);
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
