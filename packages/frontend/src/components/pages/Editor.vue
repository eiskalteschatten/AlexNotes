<template>
    <div class="logo">
        <editor />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    import Editor from '../elements/Editor.vue';

    export default Vue.extend({
        components: {
            Editor
        }
    });
</script>

<style lang="scss" scoped>
    .logo {
        background: url('../../resources/images/icon-transparent.svg') no-repeat center;
        background-size: 300px;
        height: calc(100vh - 150px);
        width: 100%;
    }
</style>
