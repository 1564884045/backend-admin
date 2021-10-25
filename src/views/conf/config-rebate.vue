<template>
    <!--    销售配置    -->
    <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
            <span>返利规则设置</span>
        </div>
        <el-form ref="form" :model="rebate" label-width="160px">
            <el-form-item label="启用返利规则" prop="open">
                <el-switch v-model="rebate.open"/>
            </el-form-item>
            <div v-if="rebate.open">
                <el-form-item label="平台保留返现比例" prop="platformRebate">
                    <el-input class="max-width-150" clearable v-model="rebate.platformRebate">
                        <template slot="append">%</template>
                    </el-input>
                    <span style="color: #636363;display: block">提示：商户商家收款金额 = 客户付款总额 - 平台保留返利金额；该金额为返利资金池</span>
                </el-form-item>

                <el-form-item label="每次消费返利比例" prop="orderRebate">
                    <el-input class="max-width-150" clearable v-model="rebate.orderRebate">
                        <template slot="append">%</template>
                    </el-input>
                    <span style="color: #636363;display: block">
                        提示：消费返利需要订单被点击完成，即完成的订单才会触发消费返利；该返利比例表示每次返利为支付订单的比例；
                        如：10% 表示每次触发返利将返利订单金额的 10%到用户
                    </span>
                </el-form-item>
                <el-form-item label="返利上限比例" prop="upperLimit">
                    <el-input class="max-width-150" clearable v-model="rebate.upperLimit">
                        <template slot="append">%</template>
                    </el-input>
                    <span style="color: #636363;display: block">
                        提示：该比例表示返利总金额占订单付款金额的比例；如：设置为100%，表示付款的全部金额都将参与返利
                    </span>
                </el-form-item>
                <el-form-item label="返利手续费比例" prop="serviceCharge">
                    <el-input class="max-width-150" clearable v-model="rebate.serviceCharge">
                        <template slot="append">%</template>
                    </el-input>
                    <span style="color: #636363;display: block">提示：手续费每笔返利都会扣除，即该比例为每次返利扣除的手续费比例</span>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="primary" @click="save()">立即保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
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
        name: "configRebate",
        data() {
            return {
                loading: false,
                rebate: {
                    open: false,
                    platformRebate: '',
                    orderRebate: '',
                    upperLimit: '',
                    serviceCharge: '',
                },
                roleArr: [],
            }
        },
        created() {
            this.loading = true;
            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    let resObj = JSON.parse(res.data.rebate);

                    let _rebate = {
                        open: false,
                        platformRebate: '',
                        orderRebate: '',
                        upperLimit: '',
                        serviceCharge: '',
                    };

                    if (resObj) _rebate = {
                        open: resObj.open,
                        platformRebate: resObj.platformRebate * 100,
                        orderRebate: resObj.orderRebate * 100,
                        upperLimit: resObj.upperLimit * 100,
                        serviceCharge: resObj.serviceCharge * 100,
                    };
                    this.rebate = _rebate;
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            })
        },
        methods: {
            save() {
                let postData = {};
                if (this.rebate.open) {
                    let _rebate = {
                        open: this.rebate.open,
                        platformRebate: this.rebate.platformRebate / 100,
                        orderRebate: this.rebate.orderRebate / 100,
                        upperLimit: this.rebate.upperLimit / 100,
                        serviceCharge: this.rebate.serviceCharge / 100,
                    };
                    postData = {
                        rebate: JSON.stringify(_rebate)
                    }
                }
                // 更新数据
                this.saveConf(postData);
            },
            saveConf(conf) {
                this.$api.post("company/conf", conf).then(ret => {
                    if (ret.code === 200)
                        this.$message.success(ret.msg);
                    else
                        this.$message.error(ret.msg);
                })
            },
            roleChange() {

            },
            defaultRoleIdChange(e) {

            },

        }
    }
</script>

<style scoped>
.max-width-150 {
    max-width: 150px;
}
</style>
