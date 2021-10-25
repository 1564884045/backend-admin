
import $api from '@/utils/api'
import $cache from '@/utils/cache'

const state = () => {
    let customSetting = $cache.getCache("SHOP_INFO");

    let defaultSetting = {
        address: "",
        adminId: "",
        appKey: "",
        applyUserId: "",
        banner: "",
        category: "",
        cover: "",
        creditCode: "",
        del: 0,
        dueDate: "",
        id: "",
        intro: "",
        lat: "",
        legalPerson: "",
        license: "",
        lng: "",
        logo: "",
        name: "",
        parentCompanyId: "",
        phone: "",
        startWorkingTime: "",
        status: 1,
        street: "",
        tag: "",
        vipId: "",
        vip: [],
    };
    Object.assign(defaultSetting, customSetting);

    return defaultSetting;
}

const getters = {}

const actions = {
    setInfo(context, info) {
        console.log(info)
        context.commit('setShopInfo', info)
    }
}

const mutations = {
    // 设置网页标题
    setShopInfo(state) {
        $api.post("shopInfo").then(res => {
            if (res.code === 200) {
                Object.assign(state, res.data);
                $cache.setCache('SHOP_INFO', res.data);
            }
        })
    },
}


/**
 * 登录店铺信息
 */
export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
