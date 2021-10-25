<template>
    <div style="max-width: 1000px;margin: auto">
        <!--    客服配置    -->
        <el-card class="box-card">
            <div slot="header" class="clearfix"><span>店铺系统配置</span>
            </div>
            <el-form ref="form" :model="conf" label-width="180px">
                <el-form-item>
                    <el-button type="primary" @click="clearAllCache">清空系统缓存</el-button>
                </el-form-item>

                <el-form-item label="前端页面链接" prop="orderRebate">
                    <el-input v-model="conf.frontUrl" placeholder="前端页面链接">
                        <template slot="append">
                            <div @click="confChange">保存</div>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="分类页展示类型" prop="integral">
                    <div>
                        <el-radio @change="confChange" v-model="conf.indexPageType" label="categoryWithProduct">
                            分类+产品模式
                        </el-radio>
                        <el-radio @change="confChange" v-model="conf.indexPageType" label="categoryWithChild">
                            上级分类+下级分类模式
                        </el-radio>
                    </div>
                    <div style="font-size: 12px;padding: 0 10px">分类+产品模式：将直接把分类与产品列出（默认模式）</div>
                    <div style="font-size: 12px;padding: 0 10px">上级分类+下级分类模式：查出上级分类与下级分类</div>
                </el-form-item>
                <el-form-item label="自动提现" prop="integral">
                    <el-switch v-model="conf.autoTX" @change="confChange"/>
                    <span style="font-size: 12px;padding: 0 10px">开启自动提现后，有付款项时，平台将自动付款到微信用户</span>
                </el-form-item>

                <el-form-item label="用户实名" prop="integral">
                    <el-switch v-model="conf.realName" @change="confChange"/>
                    <span style="font-size: 12px;padding: 0 10px">开启用户实名后，用户消费只能在实名认证之后</span>
                </el-form-item>
                <!--        <el-form-item label="开放商户申请" prop="integral" v-if="vip['branchCompany']">-->
                <!--          <el-switch v-model="conf.shopApply"/>-->
                <!--          <span style="font-size: 12px;padding: 0 10px">开启后将允许商户在应用端申请进驻</span>-->
                <!--        </el-form-item>-->
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import Vue from 'vue';

    Vue.filter("roleRebateText", function (val) {
        let _arr = JSON.parse(val);
        let _str = [];
        if (Array.isArray(_arr)) {
            _arr.forEach((item) => {
                _str.push(item.lv + "级提成: " + item.rebate)
            })
        }
        return _str.join("；")
    });
    export default {
        name: "config",
        data() {
            return {
                isUse: true,
                isUseText: '已启用',
                conf: {
                    frontUrl: '',
                    indexPageType: '',
                    realName: false,
                    autoTX: false,
                    shopApply: false,
                },
                vip: this.$store.state.shop.vip
            }
        },
        created() {
            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    this.conf = JSON.parse(res.data.config) || {};
                }
            });
        },
        methods: {
            clearAllCache() {
                let that = this;
                this.$confirm('清除缓存会导致用户需要重新登录，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.post("removeCache").then(res => {
                        if (res.code === 200) {
                            that.$message.success("清空成功!")
                        } else {
                            that.$message.error(res.msg)
                        }
                    })
                });
            },
            confChange(e) {
                let postData = {
                    config: JSON.stringify(this.conf)
                };
                this.saveConf(postData)
            },
            saveConf(conf) {
                let loading = this.$baseLoading("保存中...",1);

                this.$api.post("company/conf", conf).then(ret => {
                    loading.close();

                    if (ret.code === 200)
                        this.$message.success(ret.msg);
                    else
                        this.$message.error(ret.msg);
                }).catch(err=>{
                    loading.close();
                })
            },


        }
    }
</script>

<style scoped>
    .el-card {
        margin-bottom: 10px;
    }

    .el-input {
        margin-bottom: 10px;
    }

    .el-button {
        float: right;
        margin: 0 10% 10px;
    }

    >>> .el-card__body {
        padding: 20px 100px 20px 60px;
    }
</style>
