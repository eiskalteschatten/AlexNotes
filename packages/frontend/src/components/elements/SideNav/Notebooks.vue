<i18n>
{
    "en": {
        "createNotebook": "Create Notebook"
    },
    "de": {
        "createNotebook": "Notizbuch erstellen"
    }
}
</i18n>

<template>
    <div>
        <div class="text-xs-center">
            <v-btn class="ma-4">
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
            >
                <v-list-tile-action>
                    <v-icon>{{ notebook.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title>{{ notebook.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapActions, mapMutations } from 'vuex';

    export default Vue.extend({
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
                'getNotebooks'
            ]),
            ...mapMutations('notebooks', [
                'setSelectedNotebookId'
            ]),
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            selectNotebook(id: string): void {
                this.setSelectedNotebookId(id);
                this.$router.push({ name: 'home' });
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
