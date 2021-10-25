<template>
    <!--  短信配置  -->
    <el-card class="box-card" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.9)">
        <div slot="header" class="clearfix">
            <span>公众号配置</span>
        </div>
        <el-form ref="form" :model="gzh" label-width="180px">
            <el-form-item label="启用公众号" prop="integral">
                <el-switch v-model="gzh.open"/>
            </el-form-item>
            <div v-if="gzh.open">
                <el-form-item label="公众号类型">
                    <el-checkbox-group v-model="gzh.openList">
                        <el-checkbox label="wx">微信</el-checkbox>
                        <el-checkbox label="zfb">支付宝</el-checkbox>
                        <el-checkbox label="touTiao">头条（抖音）</el-checkbox>
                        <el-checkbox label="qq">QQ</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div v-if="gzh.openList.indexOf('wx') > -1">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>微信公众号配置</span>
                        </div>
                        <el-form-item label="公众号ID（appId）" prop="appId">
                            <el-input type="text" v-model="gzh.wx.appId"
                                      placeholder="公众号ID"/>
                        </el-form-item>
                        <el-form-item label="公众号密钥（appSecret）" prop="appSecret">
                            <el-input type="text" v-model="gzh.wx.appSecret" show-password
                                      placeholder="公众号密钥" auto-complete="new-password"/>
                        </el-form-item>
                    </el-card>
                </div>

                <div v-if="gzh.openList.indexOf('zfb') > -1" style="margin: 10px 0">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>支付宝公众号配置</span>
                        </div>
                        <span style="color: #767676;">暂未开通</span>
                    </el-card>
                </div>

                <div v-if="gzh.openList.indexOf('touTiao') > -1" style="margin: 10px 0">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>头条公众号配置</span>
                        </div>
                        <span style="color: #767676;">暂未开通</span>
                    </el-card>
                </div>
                <div v-if="gzh.openList.indexOf('qq') > -1" style="margin: 10px 0">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>头条公众号配置</span>
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
        name: "config-gzh",
        data() {
            return {
                loading: false,
                gzh: {
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
                    this.gzh = JSON.parse(res.data.gzh) || this.gzh
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            })

        },
        methods: {
            save() {
                let postData = {
                    gzh: JSON.stringify(this.gzh)
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
