import globalSettings from '../setting'
import {Loading, Message, MessageBox, Notification} from 'element-ui'
import store from '@/store'
import {getAccessToken} from '@/utils/accessToken'
import api from "@/utils/api";

const accessToken = store.getters['user/accessToken'];
const layout = store.getters['settings/layout'];
const {loadingText, messageDuration, title} = globalSettings;

const install = (Vue, opts = {}) => {
    Vue.prototype.$api = api;
    Vue.prototype.$post = api.post;
    Vue.prototype.$get = api.get;
    Vue.prototype.$baseUrl = api.baseUrl;


    /**
     * 检查是否有VIP
     * @param fun branchCompany rebate member activity salesman
     * @returns {boolean|*}
     */
    Vue.prototype.$hasVip = function (fun) {
        if (!fun) return true;
        let state = store.state;
        if (!state.shop) return false;
        if (!state.shop.vip) return false;
        let vip = state.shop.vip;
        return vip[fun]
    };

    /**
     * 检查是否有配置项
     * @param confKey
     * @param fun
     * @returns {boolean|*}
     */
    Vue.prototype.$hasConf = function (confKey, fun) {
        console.log(confKey, fun)
        if (!fun) return true;
        let state = store.state;
        if (!state.shop) return false;
        let conf = state.shop.conf;
        if (!conf) return false;
        let confItem = conf[confKey];
        if (confItem) {
            confItem = JSON.parse(confItem);
            return confItem[fun];
        }
        return false;
    };


    /* 全局accessToken */
    Vue.prototype.$baseAccessToken = () => {
        return accessToken || getAccessToken()
    };
    /* 全局标题 */
    Vue.prototype.$baseTitle = (() => {
        return title
    })();
    /* 全局加载层 */
    Vue.prototype.$baseLoading = (text, index) => {
        let loading;
        if (!index) {
            loading = Loading.service({
                lock: true,
                text: text || loadingText,
                background: 'hsla(0,0%,100%,.8)',
            })
        } else {
            loading = Loading.service({
                lock: true,
                text: text || loadingText,
                spinner: 'vab-loading-type' + index,
                background: 'hsla(0,0%,100%,.8)',
            })
        }
        return loading
    }
    /* 全局多彩加载层 */
    Vue.prototype.$baseColorfullLoading = (index, text) => {
        let loading;
        if (!index) {
            loading = Loading.service({
                lock: true,
                text: text || loadingText,
                spinner: 'dots-loader',
                background: 'hsla(0,0%,100%,.8)',
            })
        } else {
            switch (index) {
                case 1:
                    index = 'dots';
                    break;
                case 2:
                    index = 'gauge';
                    break;
                case 3:
                    index = 'inner-circles';
                    break;
                case 4:
                    index = 'plus';
                    break
            }
            loading = Loading.service({
                lock: true,
                text: text || loadingText,
                spinner: index + '-loader',
                background: 'hsla(0,0%,100%,.8)',
            })
        }
        return loading
    }
    /* 全局Message */
    Vue.prototype.$baseMessage = (message, type = 'success') => {
        switch (type) {
            case 200:
                type = 'success';
                break;
            case 400:
                type = 'warning';
                break;
            case 500:
                type = 'error';
                break;
        }
        console.log("messageDuration", messageDuration)
        Message({
            offset: 60,
            showClose: true,
            message: message,
            type: type,
            dangerouslyUseHTMLString: true,
            duration: messageDuration,
        })
    };

    /* 全局Alert */
    Vue.prototype.$baseAlert = (content, title, callback) => {
        MessageBox.alert(content, title || '温馨提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            callback: (action) => {
                if (callback) {
                    callback()
                }
            },
        })
    };

    /* 全局Confirm */
    Vue.prototype.$baseConfirm = (content, title, callback1, callback2) => {
        MessageBox.confirm(content, title || '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning',
        })
            .then(() => {
                if (callback1) {
                    callback1()
                }
            })
            .catch(() => {
                if (callback2) {
                    callback2()
                }
            })
    }

    /* 全局Notification */
    Vue.prototype.$baseNotify = (message, title, type = 'success', position = 'top-right') => {
        Notification({
            title: title,
            message: message,
            position: position,
            type: type,
            duration: messageDuration,
        })
    };

    /* 全局TableHeight */
    Vue.prototype.$baseTableHeight = (formType) => {
        let height = window.innerHeight;
        let paddingHeight = 400;
        const formHeight = 50;

        if (layout === 'vertical') {
            paddingHeight = 365
        }

        if ('number' == typeof formType) {
            height = height - paddingHeight - formHeight * formType
        } else {
            height = height - paddingHeight
        }
        return height
    };
    /* 全局事件总线 */
    Vue.prototype.$baseEventBus = new Vue()
};

export default install
