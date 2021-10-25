<template>
    <!--  短信配置  -->
    <el-card class="box-card" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.9)">
        <div slot="header" class="clearfix"><span>短信配置</span>
        </div>
        <el-form ref="form" :model="sms" label-width="180px">
            <el-form-item label="启用短信" prop="integral">
                <el-switch v-model="sms.open"/>
            </el-form-item>
            <div v-if="sms.open">
                <el-form-item label="短信类型">
                    <el-radio-group v-model="sms.type">
                        <el-radio label="ali">阿里云短信</el-radio>
                        <el-radio label="tencent">腾讯云短信</el-radio>
                    </el-radio-group>
                </el-form-item>

                <div v-if="sms.type === 'ali'">
                    <el-form-item label="短信assessKeyId" prop="accessKey">
                        <el-input type="text" v-model="sms.accessKey" show-password
                                  placeholder="短信assessKeyId" auto-complete="new-password"/>
                    </el-form-item>
                    <el-form-item label="短信secret" prop="secret">
                        <el-input type="text" v-model="sms.secret" show-password auto-complete="new-password"
                                  placeholder="短信secret"/>
                    </el-form-item>
                    <el-form-item label="短信签名" prop="signName">
                        <el-input type="text" v-model="sms.signName"
                                  placeholder="短信签名"/>
                    </el-form-item>
                    <el-form-item label="短信模板id" prop="tempCode">
                        <el-input type="text" v-model="sms.tempCode"
                                  placeholder="短信模板id"/>
                    </el-form-item>
                </div>

                <div v-if="sms.type === 'tencent'">
                    <el-form-item label="腾讯云账户密钥secretId" prop="secretId">
                        <el-input type="text" v-model="sms.secretId" show-password
                                  placeholder="腾讯云账户密钥secretId"/>
                        <el-alert show-icon
                                  type="info"
                                  :closable="false">
                            获取secretId和secretKey请访问：<a target="_blank"
                                                       href="https://console.cloud.tencent.com/cam/capi">https://console.cloud.tencent.com/cam/capi</a>
                        </el-alert>

                    </el-form-item>
                    <el-form-item label="腾讯云账户密钥secretKey" prop="secretKey">
                        <el-input type="text" v-model="sms.secretKey" show-password
                                  placeholder="腾讯云账户密钥secretKey"/>
                    </el-form-item>
                    <el-form-item label="短信签名内容" prop="sign">
                        <el-input type="text" v-model="sms.sign"
                                  placeholder="短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名"/>
                        <el-alert show-icon
                                  type="info"
                                  :closable="false">
                            获取短信签名，请访问：
                            <a target="_blank"
                               href="https://console.cloud.tencent.com/smsv2/csms-sign">https://console.cloud.tencent.com/smsv2/csms-sign</a>
                        </el-alert>
                    </el-form-item>

                    <el-form-item label="模板 ID" prop="tmpId">
                        <el-input type="text" v-model="sms.tmpId"
                                  placeholder="必须填写已审核通过的模板 ID"/>

                        <el-alert show-icon
                                  type="info"
                                  :closable="false">
                            获取模板id及短信应用id,请访问：
                            <a target="_blank"
                               href="https://console.cloud.tencent.com/smsv2/csms-template">https://console.cloud.tencent.com/smsv2/csms-template</a>
                        </el-alert>
                    </el-form-item>
                    <el-form-item label="短信应用 ID" prop="appId">
                        <el-input type="text" v-model="sms.appId"
                                  placeholder="短信应用 ID: 在 [短信控制台] 添加应用后生成的实际 SDKAppID"/>
                    </el-form-item>
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
    name: "config-sms",
    data() {
        return {
            loading: false,
            sms: {
                open: false,
                type: '', // ali tencent
                // ali
                accessKey: '',
                secret: '',
                signName: '',
                tempCode: '',

                // tencent
                secretId: '',
                secretKey: '',
                sign: '',
                tmpId: '',
                appId: '',
            },
        }
    },
    created() {
        this.loading = true;
        this.$api.get("company/conf").then(res => {
            if (res.code === 200) {
                this.sms = JSON.parse(res.data.sms) || {}
            }
            this.loading = false;
        }).catch(err => {
            this.loading = false;
        })

    },
    methods: {
        save() {
            let postData = {
                sms: JSON.stringify(this.sms)
            };
            if (!this.sms.open) postData.sms = JSON.stringify({});
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
