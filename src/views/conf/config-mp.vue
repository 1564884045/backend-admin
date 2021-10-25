

<template>
    <!--  短信配置  -->
    <el-card class="box-card" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.9)">
        <div slot="header" class="clearfix">
            <span>小程序配置</span>
        </div>
        <el-form ref="form" :model="mp" label-width="180px">
            <el-form-item label="启用小程序" prop="integral">
                <el-switch v-model="mp.open"/>
            </el-form-item>
            <div v-if="mp.open">
                <el-form-item label="小程序类型">
                    <el-checkbox-group v-model="mp.openList">
                        <el-checkbox label="wx">微信</el-checkbox>
                        <el-checkbox label="zfb">支付宝</el-checkbox>
                        <el-checkbox label="touTiao">头条（抖音）</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div v-if="mp.openList.indexOf('wx') > -1">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>微信小程序配置</span>
                        </div>
                        <el-form-item label="小程序ID（appId）" prop="appId">
                            <el-input type="text" v-model="mp.wx.appId"
                                      placeholder="小程序ID"/>
                        </el-form-item>
                        <el-form-item label="小程序密钥（appSecret）" prop="appSecret">
                            <el-input type="text" v-model="mp.wx.appSecret" show-password
                                      placeholder="小程序密钥" auto-complete="new-password"/>
                        </el-form-item>
                    </el-card>
                </div>

                <div v-if="mp.openList.indexOf('zfb') > -1" style="margin: 10px 0">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>支付宝小程序配置</span>
                        </div>
                        <span style="color: #767676;">暂未开通</span>
                    </el-card>
                </div>

                <div v-if="mp.openList.indexOf('touTiao') > -1" style="margin: 10px 0">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>头条小程序配置</span>
                        </div>
                        <span style="color: #767676;">暂未开通</span>
                    </el-card>
                </div>
            </div>
            <el-form-item>
                <el-button type="primary" @click="save()">立即保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    export default {
        name: "config-mp",
        data() {
            return {
                loading: false,
                mp: {
                    open: false,
                    openList: [],
                    wx: {
                        appId: '',
                        appSecret: '',
                    },
                    zfb: {}
                },
            }
        },
        created() {
            this.loading = true;
            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    this.mp = JSON.parse(res.data.mp) || this.mp
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            })

        },
        methods: {
            save() {
                let postData = {
                    mp: JSON.stringify(this.mp)
                };
                // 更新数据
                this.saveConf(postData)
            },
            saveConf(conf) {
                this.$api.post("company/conf", conf).then(ret => {
                    if (ret.code === 200)
                        this.$message.success(ret.msg);
                    else
                        this.$message.error(ret.msg);
                })
            },
        }
    }
</script>

<style scoped>

</style>
