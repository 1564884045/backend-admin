/* 公共引入,勿随意修改,修改时需经过确认 */

import api from "@/utils/api";
import cache from "@/utils/cache";
import vab from "@/utils/vab";

export default {
    install: Vue => {
        Vue.use(vab)
        Vue.use(api);
        Vue.use(cache)
    }
}
