import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import VueAMap from 'vue-amap'
import '@/components/autoRegister'
import '@/assets/assets'
import setting from "@/setting";


import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

Vue.prototype.$setting = setting;

import install from '@/utils/install'
Vue.use(install);

// 初始化vue-amap
VueAMap.initAMapApiLoader({
    key: '856e3ed96cf7f8c23448a9062a22118d',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType',
        'AMap.Geolocation', 'AMap.Geocoder', 'AMap.AMapManager', 'AMap.Marker'
    ],
    v: '1.4.4'
});
Vue.use(VueAMap);

Vue.config.productionTip = false;

import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys


Vue.prototype.$eventBus = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
