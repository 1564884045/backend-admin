<template>
    <!--    销售配置    -->
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>返利规则设置</span>
        </div>
        <el-form ref="form" :model="integral" label-width="160px">
            <el-form-item label="启用返利规则" prop="open">
                <el-switch v-model="integral.open"/>
            </el-form-item>
            <div v-if="integral.open">
                <el-form-item label="平台保留返现比例" prop="platformRebate">
                    <el-input v-model="integral.platformRebate"/>
                    <span style="color: #636363">提示：商户商家收款金额 = 客户付款总额 - 平台保留返利金额</span>
                </el-form-item>

                <el-form-item label="每次消费返利比例" prop="orderRebate">
                    <el-input v-model="integral.orderRebate"/>
                    <span style="color: #636363">提示：消费返利需要订单被点击完成，即完成的订单才会触发消费返利</span>
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
        name: "configIntegral",
        data() {
            return {
                loading: false,
                integral: {
                    open: false,
                    defaultRoleId: '',
                    toBeKey: '', // 成为销售的规则，消费满、充值、审核
                    rules: []
                },
                roleArr: [],
            }
        },
        created() {
            this.uploadUrl = this.$api.baseUrl + '/upload/' + this.$store.state.shop.id + '/share';
            this.loading = true;

            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    this.integral = JSON.parse(res.data.integral) || {
                        open: false,
                        defaultRoleId: '',
                        toBeKey: '',
                        rules: []
                    };
                }
            });
        },
        methods: {
            save() {
                let postData = {};
                if (this.integral.open) {
                    postData = {
                        integral: JSON.stringify(this.integral)
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
            addRecord() {
                if (!this.integral.rules) this.integral.rules = [];
                this.integral.rules.push({
                    roleId: '',
                    money: ''
                })
            },
            del(row, index) {
                this.integral.rules.splice(index, 1)
            },
        }
    }
</script>

<style scoped>

</style>
