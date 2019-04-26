import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.interceptors.push((request): void => {
    request.headers.set('Authorization', localStorage.getItem('jwt') ? `Bearer ${localStorage.getItem('jwt')}` : '');
});

Vue.http.options.root = '/';

export function setRoot(root): void {
    Vue.http.options.root = root;
}

export default Vue.http;
