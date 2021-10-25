<template>
    <div>
       欢迎来到管理后台，数据统计正在实现中....
    </div>
</template>

<script>
export default {
    data() {
        return {
            diff: [{
                basic: [
                    '3 套页面布局',
                    '1 款主题风格',
                    '6 个侧边栏导航配置项',
                    '支持外链导航',
                    '支持全方位权限验证',
                    '10+ 个基础组件',
                    '支持 Mock 数据',
                    '团队代码规范',
                    '需保留作者版权信息'
                ],
                pro: [
                    '12 套页面布局',
                    '6 款主题风格',
                    '10 个侧边栏导航配置项',
                    '支持外链导航',
                    '支持内嵌导航',
                    '支持 Tab 标签栏',
                    '支持全方位权限验证',
                    '10+ 个基础组件',
                    '提供扩展组件',
                    '支持国际化',
                    '支持 Mock 数据',
                    '支持错误日志上报',
                    '支持文件自动生成',
                    '提供业务应用静态页面（长期扩充）',
                    '团队代码规范',
                    '可自定义版权信息',
                    '提供一对一技术支持'
                ]
            }]
        }
    },
    methods: {
        open(url) {
            window.open(url, 'top')
        },
        onIconClick(val) {
            this.$message({
                message: `你点击了：${val}`,
                type: 'info'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.fa-info {
    padding: 10px 0 0;
    text-align: center;
    h1 {
        margin: 10px auto 20px;
    }
}
.question {
    .answer {
        margin: 20px 0 0;
        padding-left: 20px;
        font-size: 14px;
        color: #aaa;
        li {
            margin-bottom: 10px;
            line-height: 1.5;
            &:last-child {
                margin-bottom: 0;
            }
        }
        span {
            color: #666;
            font-weight: bold;
        }
    }
}
.icon-box {
    padding: 20px;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        color: #fff;
    }
    &-1 {
        color: #ffc069;
        &:hover {
            background-color: #ffc069;
        }
    }
    &-2 {
        color: #b37feb;
        &:hover {
            background-color: #b37feb;
        }
    }
    &-3 {
        color: #95de64;
        &:hover {
            background-color: #95de64;
        }
    }
    &-4 {
        color: #ff85c0;
        &:hover {
            background-color: #ff85c0;
        }
    }
    &-5 {
        color: #ff9c6e;
        &:hover {
            background-color: #ff9c6e;
        }
    }
    &-6 {
        color: #282c34;
        &:hover {
            background-color: #282c34;
        }
    }
    i {
        font-size: 24px;
    }
    .title {
        margin-top: 5px;
        font-size: 14px;
    }
}
</style>
