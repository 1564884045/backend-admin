<template>
    <div id="app">
        <RouterView/>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    watch: {
        '$store.state.keepAlive.list'(val) {
            process.env.NODE_ENV === 'development' && console.log(`[ keepAliveList ] ${val}`)
        },
        // 显示状态的改变
        '$store.state.settings.mode': {
            handler() {
                if (this.$store.state.settings.mode === 'pc') {
                    this.$store.commit('settings/updateThemeSetting', {
                        'sidebarCollapse': this.$store.state.settings.sidebarCollapseLastStatus
                    })
                } else if (this.$store.state.settings.mode === 'mobile') {
                    this.$store.commit('settings/updateThemeSetting', {
                        'sidebarCollapse': true
                    })
                }
                document.body.setAttribute('data-mode', this.$store.state.settings.mode)
            },
            immediate: true
        },

    },
    mounted() {
        window.onresize = () => {
            this.$store.commit('settings/setMode', document.body.clientWidth);
        }
        window.onresize();

        this.$store.dispatch('user/getUserInfo');

        this.$request(this.$baseUrl + "/encrypt/rsa", {}).then(res => {
            this.$setCache("RSA_PUB_KEY", res.data)
        });

        this.$request(this.$baseUrl + "/backend/location/ip", {}).then(res => {
            console.log("地址信息", res)
            if (res.code === 200) {
                this.$setCache("LOCATION", res.data);
            }
        });
        document.title = this.$setting.title;
    },
    methods: {},
    metaInfo() {
        return {
            title: this.$store.state.settings.enableDynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${this.$setting.title}` : this.$setting.title
            }
        }
    }
}
</script>

<style scoped lang="scss">
#app {
    height: 100%;
}
</style>
