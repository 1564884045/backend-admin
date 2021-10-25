import Vue from 'vue'
import globalSettings from '@/setting'

import {getAccessToken, removeAccessToken, setAccessToken} from '@/utils/accessToken'
import router from '@/router'

import {encryptedData} from '@/utils/encrypt'
import $api from '@/utils/api'
import $cache from '@/utils/cache'
import {isBlank} from "@/utils/validate";

const state = () => {
    let token = getAccessToken();
    console.log("token", token)
    return {
        accessToken: token,
        username: '',
        avatar: '',
        permissions: [],
        hasLogin: !isBlank(token),
    }
};
const getters = {
    accessToken: (state) => state.accessToken,
    username: (state) => state.username,
    avatar: (state) => state.avatar,
    permissions: (state) => state.permissions,
    hasLogin: (state) => state.hasLogin,
};
const mutations = {
    setAccessToken(state, accessToken) {
        state.accessToken = accessToken;
        setAccessToken(accessToken)
    },
    setUsername(state, username) {
        state.username = username
    },
    setAvatar(state, avatar) {
        state.avatar = avatar
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    },
    setHasLogin(state, hasLogin) {
        state.hasLogin = hasLogin
    },
};
const actions = {
    setPermissions({commit}, permissions) {
        commit('setPermissions', permissions)
    },
    /**
     * 用户登录
     * @param context
     * @param userInfo
     * @returns {Promise<void>}
     */
    async login(context, userInfo) {
        console.log("触发登录")
        return new Promise(async (resolve, reject) => {
            console.log(userInfo);
            let loginData = {
                account: userInfo.account,
                password: userInfo.password,
                device: 'PC'
            };
            let publicKey = $cache.getCache("RSA_PUB_KEY");
            let encode = await encryptedData(loginData, publicKey);
            console.log("加密之后", encode);

            $api.request($api.baseUrl + '/backend/login', encode, 'POST')
                .then(res => {
                    if (res.code === 200) {
                        let accessToken = res.data;
                        if (accessToken) {
                            context.commit('setAccessToken', accessToken);
                            context.commit('setHasLogin', true);
                            context.dispatch('getUserInfo')

                            const hour = new Date().getHours();
                            const thisTime =
                                hour < 2
                                    ? '午夜好' :
                                    hour < 4
                                        ? '夜猫子好' :
                                        hour < 8
                                            ? '早上好'
                                            : hour <= 11
                                            ? '上午好'
                                            : hour <= 13
                                                ? '中午好'
                                                : hour < 18
                                                    ? '下午好'
                                                    : '晚上好';
                            Vue.prototype.$baseNotify(`欢迎登录${globalSettings.title}`, `${thisTime}！${userInfo.account}`);
                            resolve(res.data);
                        } else {
                            Vue.prototype.$baseMessage(res.msg, 400)
                        }
                    } else {
                        Vue.prototype.$baseMessage(res.msg, 400)
                        reject(res);
                    }
                }).catch(err => {
                reject(err);
            })
        })
    },
    /**
     * 退出登录
     * @param commit
     * @returns {Promise<void>}
     */
    async logout({commit}) {
        commit('setPermissions', []);
        commit('setAccessToken', '');
        commit('setHasLogin', false);
        removeAccessToken()
    },
    /**
     * 获取用户信息
     * @param commit
     * @param state
     * @param dispatch
     * @returns {Promise<boolean|*>}
     */
    async getUserInfo({commit, state, dispatch}) {
        if (!state.hasLogin) return;

        const {data, code} = await $api.get("admin/info");

        if (code === 100) {
            commit('setHasLogin', false);
            removeAccessToken()
            Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error');
            router.push('/login').catch((err) => {
                console.log(err)
            });
            return false
        }
        if (code === 200) {
            let {username, avatar, company} = data;
            let permissions = ['admin'];
            commit('setPermissions', permissions);
            commit('setUsername', username);
            commit('setAvatar', avatar);
            commit('setHasLogin', true);
            dispatch('shop/setInfo', company,{root: true})
            return permissions
        } else {
            Vue.prototype.$baseMessage('用户信息接口异常', 'error');
            return false
        }

    },

    // 获取我的权限
    getPermissions({state}) {
        console.log("获取我的权限/state", state)
        return new Promise(resolve => {
            resolve(state.permissions)
        })
    }
};
export default {state, getters, mutations, actions}
