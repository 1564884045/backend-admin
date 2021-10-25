import globalSettings from "@/setting";

const localStorage = window.localStorage;
const storageType = globalSettings.storageType;
/**
 *
 * @description 获取accessToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
const getCache = (key) => {
    let data;
    if (storageType) {
        if ('localStorage' === storageType) {
            data = localStorage.getItem(key)
        } else if ('sessionStorage' === storageType) {
            data = sessionStorage.getItem(key)
        } else {
            data = localStorage.getItem(key)
        }
    } else {
        data = localStorage.getItem(key)
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

/**
 * @description 存储accessToken
 * @returns {void|*}
 * @param key
 * @param data
 */
const setCache = (key, data) => {
    data = JSON.stringify(data)
    if (storageType) {
        if ('localStorage' === storageType) {
            return localStorage.setItem(key, data)
        } else if ('sessionStorage' === storageType) {
            return sessionStorage.setItem(key, data)
        } else {
            return localStorage.setItem(key, data)
        }
    } else {
        return localStorage.setItem(key, data)
    }
};

/**
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
const removeCache = (key) => {
    if (storageType) {
        if ('localStorage' === storageType) {
            return localStorage.removeItem(key)
        } else if ('sessionStorage' === storageType) {
            return sessionStorage.clear()
        } else {
            return localStorage.removeItem(key)
        }
    } else {
        return localStorage.removeItem(key)
    }
};

export default {
    getCache,
    setCache,
    removeCache,
    install: Vue => {
        Vue.prototype.$getCache = getCache;
        Vue.prototype.$setCache = setCache;
        Vue.prototype.$removeCache = removeCache;
    }
}
