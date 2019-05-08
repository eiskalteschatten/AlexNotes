<i18n>
{
    "en": {
        "createNotebook": "Create Notebook",
        "name": "Name",
        "cancel": "Cancel",
        "save": "Save"
    },
    "de": {
        "createNotebook": "Notizbuch erstellen",
        "name": "Name",
        "cancel": "Abbrechen",
        "save": "Speichern"
    }
}
</i18n>

<template>
    <div>
        <v-dialog v-model="newNotebookDialog" max-width="350">
            <v-card>
                <v-card-title class="headline">{{ $t('createNotebook') }}</v-card-title>

                <v-card-text>
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
        data() {
            return {
                newNotebookDialog: false,
                newNotebookName: '',
                newNotebookIsSaving: false
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
                'saveNotebook'
            ]),
            ...mapMutations('notebooks', [
                'setSelectedNotebookId'
            ]),
            getActiveClass(isActive: boolean): string {
                return isActive ? this.activeClass : '';
            },
            async saveNewNotebook(): Promise<void> {
                this.newNotebookIsSaving = true;
                await this.saveNotebook(this.newNotebookName);
                this.closeNewNotebookDialog();
            },
            closeNewNotebookDialog(): void {
                this.newNotebookName = '';
                this.newNotebookDialog = false;
                this.newNotebookIsSaving = false;
            },
            selectNotebook(id: string): void {
                this.setSelectedNotebookId(id);
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
