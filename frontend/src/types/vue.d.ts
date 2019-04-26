
import Vue from 'vue';
import { HttpHeaders, HttpOptions, Http, $http, $resource } from './vueResource';

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        http?: (HttpOptions & { headers?: HttpHeaders } & { [key: string]: any });
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        /* eslint-disable @typescript-eslint/class-name-casing */
        $http: Http;
        $resource: $resource;
        /* eslint-enable  @typescript-eslint/class-name-casing */
    }

    interface VueConstructor {
        http: Http;
        resource: $resource;
    }
}
