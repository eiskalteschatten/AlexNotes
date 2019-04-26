
import Vue from 'vue';
import { HttpHeaders, HttpOptions, HttpResponse, Http, $http, $resource } from './vueResource';

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        http?: (HttpOptions & { headers?: HttpHeaders } & { [key: string]: any })
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $http: Http;
        $resource: $resource;
    }

    interface VueConstructor {
        http: Http;
        resource: $resource;
    }
}
