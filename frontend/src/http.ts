import Vue from 'vue';
import VueResource from 'vue-resource';
import { HttpOptions } from './types/VueResource';

Vue.use(VueResource);

Vue.http.interceptors.push((request: HttpOptions): void => {
    request.headers.set('Authorization', localStorage.getItem('jwt') ? `Bearer ${localStorage.getItem('jwt')}` : '');
});

Vue.http.options.root = '/';

export function setRoot(root: string): void {
    Vue.http.options.root = root;
}

export default Vue.http;
