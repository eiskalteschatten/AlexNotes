import http from '../http';
import { fillStore } from '../store';

export default {
    namespaced: true,
    state: {
        info: {},
        currentJwt: ''
    },

    getters: {
        user: state => state.user,
        jwt: state => state.currentJwt,
        jwtData: (state, getters) => state.currentJwt ? JSON.parse(atob(getters.jwt.split('.')[1])) : null,
        jwtSubject: (state, getters) => getters.jwtData ? getters.jwtData.sub : null,
        jwtIssuer: (state, getters) => getters.jwtData ? getters.jwtData.iss : null
    },

    mutations: {
        setInfo(state, info) {
            state.info = info;
        },
        setJwt(state, jwt) {
            state.currentJwt = jwt;
        }
    },

    actions: {
        async fetchJwt({ commit, dispatch }, body) {
            try {
                let jwt = localStorage.getItem('jwt');
                let jwtIsValid = false;
                let user = {};

                if (jwt) {
                    // If the response status isn't 200, it throws an error and is caught below
                    const res = await http.post('api/auth/validate', {}, {
                        headers: {
                            Authorization: `Bearer ${jwt}`
                        }
                    });

                    jwtIsValid = true;
                    user = res.body.user || {};
                }
                else {
                    const res = await http.post('api/auth/login', body);
                    const hasUserData = res.body.user && res.body.token;
                    jwt = hasUserData ? res.body.token : null;
                    user = hasUserData ? res.body.user : {};
                    jwtIsValid = jwt ? true : false;
                }

                if (jwt && jwtIsValid) {
                    commit('setInfo', user);
                    commit('setJwt', jwt);
                    localStorage.setItem('jwt', jwt);

                    await fillStore();

                    return true;
                }

                await dispatch('removeJwt');
                return false;
            }
            catch(error) {
                console.error(error);
                await dispatch('removeJwt');
                return false;
            }
        },
        async removeJwt({ commit }) {
            try {
                await http.post('api/auth/logout');
                commit('setJwt', '');
                localStorage.removeItem('jwt');
                return true;
            }
            catch(error) {
                return false;
            }
        },
        async saveUserInfo({ commit }, body) {
            try {
                const res = await http.put('api/user/edit', body);

                commit('setInfo', body);

                return {
                    code: res.status,
                    message: res.bodyText
                };
            }
            catch(error) {
                console.error(error);
                return {
                    code: 500,
                    message: error
                };
            }
        }
    }
};
