<i18n>
{
    "en": {
        "dashboard": "Dashboard",
        "clients": "Clients"
    },
    "de": {
        "dashboard": "Dashboard",
        "clients": "Kunden"
    }
}
</i18n>

<template>
    <v-bottom-nav
        :active.sync="bottomNav"
        :value="$vuetify.breakpoint.smAndDown"
        fixed
        app
    >
        <v-btn
            v-for="item in items"
            :key="item.title"
            color="primary"
            flat
            :value="item.routeName"
            @click="$router.push({ name: item.routeName })"
        >
            <span>{{ $t(item.title) }}</span>
            <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
    </v-bottom-nav>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        data () {
            return {
                items: [
                    { title: 'dashboard', icon: 'dashboard', routeName: 'home' },
                    { title: 'clients', icon: 'people', routeName: 'clients' },
                ]
            };
        },
        computed: {
            bottomNav: {
                get(): string {
                    return this.$route.name || '';
                },
                set(): void {}
            }
        }
    });
</script>

<style lang="scss">

</style>
