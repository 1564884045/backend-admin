<template>
    <el-card class="box-card">
        <el-container>
            <el-main style="padding: 0">
                <div class="wxchat-container" :style="{backgroundColor: wrapBg}">
                    <div class="window" id="window-view-container" style="height: 450px; position: relative">
                        <!-- data is empty -->
                        <div class="loading" v-if="msgList && msgList.length===0">
                            <div style="text-align:center; font-size: 16px;">
                                <span>未查找到聊天记录</span>
                            </div>
                        </div>

                        <!-- loading -->
                        <div class="loading" v-if="loading">
                            <div>
                                <div>加载中...</div>
                            </div>
                        </div>
                        <!-- main -->
                        <ScrollLoader :minHeight="minHeight" @scroll-to-top="refresh" @scroll-to-botton="infinite"
                                      class="container-main" v-if="msgList && msgList.length>0"
                                      style="height: 100%">
                            <div class="message">
                                <ul>
                                    <li v-for="(message, index) in msgList" :key="index"
                                        :class="message.my?'an-move-right':'an-move-left'">
                                        <p class="time"><span v-text="message.ctime"/></p>
                                        <p class="time system" v-if="message.type===10000">
                                            <span v-html="message.msg"/>
                                        </p>
                                        <div :class="'main' + (message.my?' self':'')" v-else>

                                            <el-avatar v-if="!message.my" class="avatar" icon="el-icon-user-solid"
                                                       :size="50"
                                                       :src="avatar">
                                            </el-avatar>
                                            <!-- 文本 -->
                                            <div class="text" v-html="message.msg" v-if="message.type===1"></div>

                                            <!-- 图片 -->
                                            <div class="text" v-else-if="message.type===2">
                                                <el-image :src="message.msg">
                                                    <div slot="error" class="image-slot">
                                                        <i class="el-icon-picture-outline"></i>
                                                        加载失败
                                                    </div>
                                                </el-image>
                                            </div>

                                            <!-- 其他 -->
                                            <div class="text" v-else-if="message.type!==10000"
                                                 v-text="'[暂未支持的消息类型:'+ message.type +']\n\r' + message.msg">
                                            </div>
                                        </div>
                                    </li>

                                </ul>
                            </div>
                        </ScrollLoader>
                        <div style="display:flex; position: absolute;bottom: 0;width: 100%;background-color: #FFF; padding: 5px;">
                            <el-input v-model="msg" style="width: 70%" placeholder="请输入发送内容"/>
                            <div style="width: 25%; display: flex; justify-content: center">
                                <el-button size="mini" type="primary" @click="sendMsg">发送</el-button>
                            </div>
                        </div>
                    </div>

                </div>
            </el-main>
        </el-container>
    </el-card>
</template>

<script>
    import ScrollLoader from './scrollLoader.vue';

    export default {
        name: "chatBox",
        components: {
            ScrollLoader
        },
        props: {
            userId: {
                type: String,
                default: '',
                required: true,
            },
            nickname: {
                type: String,
                default: '',
                required: true,
            },
            avatar: {
                type: String,
                default: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            },

            width: {
                type: Number,
                default: 650,
            },

            wrapBg: {
                type: String,
                default: '#efefef'
            },

            maxHeight: {
                type: Number,
                default: 700
            },
            minHeight: {
                type: Number,
                default: 700
            },


            ownerAvatarUrl: {
                type: String,
            }
        },

        data() {
            return {
                msg: '',
                isUpperLaoding: false,
                isUnderLaoding: false,
                loading: false,

                isRefreshedAll: false,
                isLoadedAll: false,

                msgList: [],

                page: 1,
                pageSize: 20,

                socket: null
            }
        },
        created() {
            this.getData();
            this.$ws.connect();
            this.$ws.onMsg = (res) => {
                console.log("聊天窗口", res);
                if (res.code === 200) {
                    if (res.data) {
                        let msgData = JSON.parse(res.data);
                        this.msgList.push({
                            msg: msgData.msg,
                            my: false,
                            type: 1
                        });
                    }
                }

            }
        },

        methods: {
            async getData() {
                let pageData = {
                    pageSize: this.pageSize,
                    page: this.page
                };
                this.$api.get("notice/member/" + this.userId, pageData).then(res => {
                    if (res.code === 200) {
                        let _list = [];
                        res.data.list.forEach(item => {
                            _list.push({
                                my: !item.userId,
                                id: item.id, //根据这个来排序消息
                                type: 1, //1为文本，2为图片
                                msg: item.msg, //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
                                ctime: item.createTime //显示当前消息的发送时间
                            })
                        });

                        this.msgList = _list;
                    }
                })
                // this.msgList = [{
                //     my: false,
                //     id: 1, //根据这个来排序消息
                //     type: 1, //1为文本，2为图片
                //     msg: '你好!![呲牙]', //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
                //     ctime: new Date().toLocaleString() //显示当前消息的发送时间
                // },
                //     {
                //         my: true,
                //         id: 2,
                //         type: 1,
                //         msg: '你也好。[害羞]',
                //         ctime: new Date().toLocaleString()
                //     }];
            },
            sendMsg() {
                // 消息为空不做任何操作
                if (this.msg === "") {
                    return this.$message.warning("消息不能为空");
                }
                // 显示消息 msg消息文本,my鉴别是谁发的消息(不能用俩个消息数组循环,否则消息不会穿插)
                var msg = this.msg.replace(/(^\s*)|(\s*$)/g, "");
                if (!msg) return;
                this.msgList.push({
                    msg: msg,
                    my: true,
                    type: 1
                });
                // 保证消息可见
                // this.msgGo()
                // 回答问题
                this.msgSendAction(this.msg);
                // 清除消息
                this.msg = ""
            },
            msgSendAction: function (x) {
                // 这里连接服务器获取答案
                // 下面模拟请求
                this.$api.post("im", {
                    toUser: this.userId,
                    msg: x
                }).then(res => {
                    if (res.code === 200) {
                        // 消息发送成功 加载loading
                        this.msgLoad = true;
                    }
                })
            },

            getUnderData() {

            },

            getUpperData() {

            },

            //向上拉刷新
            refresh(done) {
                var me = this;
                if (me.isUpperLaoding) {
                    return;
                }

                if (me.isRefreshedAll) {
                    done(true);
                    me.isUpperLaoding = false;
                    return;
                }

                try {
                    this.getUpperData().then(function (data) {
                        if (data.length === 0) {
                            me.isRefreshedAll = true;
                            done(true);
                        } else {
                            me.msgList = data.reverse().concat(me.msgList); //倒序合并
                            done();
                        }
                    })
                } catch (error) {
                    console.error('wxChat: props "getUpperData" must return a promise object!')
                }
                me.isUpperLaoding = false;
            },

            //向下拉加载
            infinite(done) {
                var me = this;
                if (me.isUnderLaoding) {
                    return;
                }
                if (me.isLoadedAll) {
                    done(true);
                    me.isUnderLaoding = false;
                    return;
                }

                try {
                    this.getUnderData().then(function (data) {
                        if (data === 0) {
                            me.isLoadedAll = true;
                            done(true);
                        } else {
                            done();
                            me.msgList = me.msgList.concat(data); //直接合并
                        }
                    })
                } catch (error) {
                    console.error('wxChat: props "getUnderData" must return a promise object!')
                }
                me.isUnderLaoding = false;
            }

        }
    }
</script>
<style scoped>
    >>> .el-card__body {
        padding: 0;
    }

    .shadow {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .2;
    }

    .window {
        min-width: 300px;
        background: #F5F5F5;
        overflow: hidden;
        padding: 0;
        height: 100%;
        position: relative;
        z-index: 101;
    }

    .w100 {
        width: 100%;
    }

    .mt5 {
        margin-top: 5px;
    }

    .mt10 {
        margin-top: 10px;
    }

    .mt20 {
        margin-top: 20px;
    }

    .mb10 {
        margin-bottom: 10px;
    }

    .mb20 {
        margin-bottom: 20px;
    }

    .fs0 {
        font-size: 0
    }

    .title {
        background: #000;
        text-align: center;
        color: #fff;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
    }

    .loading, .no-more {
        text-align: center;
        color: #b0b0b0;
        line-height: 100px;
    }

    .no-more {
        line-height: 60px;
    }

    .pull-right {
        float: right;
    }

    .link-line {
        text-decoration: underline;
    }

    .message {
        /*height: 100%;*/
        padding: 10px 15px;
        /*overflow-y: scroll;*/
        background-color: #F5F5F5;
    }

    .message li {
        margin-bottom: 15px;
        left: 0;
        position: relative;
        display: block;
    }

    .message .time {
        margin: 10px 0;
        text-align: center;
    }

    .message .text {
        display: inline-block;
        position: relative;
        max-width: calc(100% - 75px);
        min-height: 35px;
        line-height: 2.1;
        font-size: 15px;
        padding: 6px 10px;
        text-align: left;
        word-break: break-all;
        background-color: #fff;
        color: #000;
        border-radius: 4px;
        box-shadow: 0px 1px 7px -5px #000;
    }

    .message .avatar {
        float: left;
        margin: 0 10px 0 0;
    }

    .message .time > span {
        display: inline-block;
        padding: 0 5px;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        background-color: #DADADA;
    }

    .message .system > span {
        padding: 4px 9px;
        text-align: left;
    }

    .message .text:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #fff;
    }

    .message .self {
        text-align: right;
    }

    .message .self .avatar {
        float: right;
        margin: 0 0 0 10px;
    }

    .message .self .text {
        background-color: #9EEA6A;
    }

    .message .self .text:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #9EEA6A;
    }

    .message .image {
        max-width: 200px;
    }

    img.static-emotion-gif, img.static-emotion {
        vertical-align: middle !important;
    }

    .an-move-left {
        left: 0;
        animation: moveLeft .7s ease;
        -webkit-animation: moveLeft .7s ease;
    }

    .an-move-right {
        left: 0;
        animation: moveRight .7s ease;
        -webkit-animation: moveRight .7s ease;
    }

    .bgnone {
        background: none;
    }

    @keyframes moveRight {
        0% {
            left: -30px;
            opacity: 0
        }
        100% {
            left: 0;
            opacity: 1
        }
    }

    @-webkit-keyframes moveRight {
        0% {
            left: -50px;
            opacity: 0
        }
        100% {
            left: 0px;
            opacity: 1
        }
    }

    @keyframes moveLeft {
        0% {
            left: 20px;
            opacity: 0
        }
        100% {
            left: 0px;
            opacity: 1
        }
    }

    @-webkit-keyframes moveLeft {
        0% {
            left: 20px;
            opacity: 0
        }
        100% {
            left: 0px;
            opacity: 1
        }
    }

    @media (max-width: 367px) {
        .fzDInfo {
            width: 82%;
        }
    }

</style>
