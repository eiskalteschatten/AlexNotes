<template>
    <v-list-tile
        class="nav-item"
        :class="getActiveClass(selectedFolderId === folder.id)"
    >
        <v-list-tile-action>
            <v-icon>{{ folder.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
            <v-text-field
                v-if="isBeingRenamed"
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

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapActions, mapMutations } from 'vuex';

    export default Vue.extend({
        props: {
            folder: Object,
            isBeingRenamed: Boolean,
            depth: Number
        },
        computed: {
            ...mapState('settings', [
                'theme'
            ]),
            ...mapState('folders', [
                'selectedFolderId'
            ]),
            activeClass(): string {
                return this.theme === 'dark' ? 'active' : 'active-light';
            }
        },
        methods: {
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
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
