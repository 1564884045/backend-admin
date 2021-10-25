<template>
    <!--  短信配置  -->
    <el-card class="box-card" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.9)">
        <div slot="header" class="clearfix"><span>支付配置</span>
        </div>
        <el-form ref="form" :model="pay" label-width="180px">
            <el-form-item label="启用支付" prop="integral">
                <el-switch v-model="pay.open"/>
            </el-form-item>
            <div v-if="pay.open">
                <el-form-item label="支付类型">
                    <el-checkbox-group v-model="pay.openList">
                        <el-checkbox label="wxPay">微信</el-checkbox>
                        <el-checkbox label="aliPay">支付宝</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <div v-if="pay.openList.indexOf('wxPay') > -1">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>微信支付配置</span>
                        </div>
                        <el-form-item label="关联的公众号或小程序appId（appId）" prop="appId">
                            <el-input type="text" v-model="pay.wxPay.appId"
                                      placeholder="关联的公众号或小程序appId"/>
                        </el-form-item>

                        <el-form-item label="微信支付商户号（mchId）" prop="mchId">
                            <el-input type="text" v-model="pay.wxPay.mchId"
                                      placeholder="微信支付商户号"/>
                        </el-form-item>

                        <el-form-item label="微信支付商户ApiKey（mchApiKey）" prop="mchApiKey">

                            <el-input type="text" v-model="pay.wxPay.mchApiKey" show-password
                                      auto-complete="new-password"
                                      placeholder="微信支付商户ApiKey"/>
                        </el-form-item>
                        <el-form-item label="微信支付商户操作证书（apiClientCert）" prop="apiClientCert">
                            <el-upload
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    :multiple="false"
                                    :show-file-list="false"
                                    :on-success="apiClientCertSuccess">
                                <el-button size="small" type="primary">{{pay.wxPay.apiClientCert? '已上传' : '点击上传'}}</el-button>
                                <div slot="tip" class="el-upload__tip">微信支付商户操作证书Key</div>
                            </el-upload>
                        </el-form-item>

                        <el-form-item label="微信支付商户操作证书Key（apiClientKey）" prop="apiClientKey">
                            <el-upload
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    :multiple="false"
                                    :show-file-list="false"
                                    :on-success="apiClientKeySuccess">
                                <el-button size="small" type="primary">{{pay.wxPay.apiClientKey? '已上传' : '点击上传'}}
                                </el-button>
                                <div slot="tip" class="el-upload__tip">微信支付商户操作证书Key</div>
                            </el-upload>
                        </el-form-item>
                    </el-card>
                </div>

                <div style="margin: 10px 0" v-if="pay.openList.indexOf('aliPay') > -1">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>支付宝支付配置</span>
                        </div>
                        <span style="color: #767676">暂未开通</span>
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
        name: "config-pay",
        data() {
            return {
                loading: false,
                uploadUrl: '',
                pay: {
                    open: false,
                    openList: [],
                    wxPay: {
                        mchId: '',
                        appId: '',
                        mchApiKey: '',
                        apiClientCert: '',
                        apiClientKey: '',
                    },
                    aliPay: {}
                },
            }
        },
        created() {
            this.uploadUrl = this.$baseUrl + '/upload/' + this.$store.state.shop.id + '/pay';
            this.loading = true;
            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    this.pay = JSON.parse(res.data.pay) || this.pay
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            })

        },
        methods: {
            save() {
                let postData = {
                    pay: JSON.stringify(this.pay)
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
            apiClientCertSuccess(e) {
                console.log(e);
                if (e.code == 200) {
                    this.pay.wxPay.apiClientCert = e.data.path;
                }
            },
            apiClientKeySuccess(e) {
                console.log(e);
                if (e.code == 200) {
                    this.pay.wxPay.apiClientKey = e.data.path;
                }
            }
        }
    }
</script>

<style scoped>

</style>
