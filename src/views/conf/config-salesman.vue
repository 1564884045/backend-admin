<template>
    <!--    销售配置    -->
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>店铺销售规则设置</span>
        </div>
        <el-form ref="form" :model="salesman" label-width="160px">
            <el-form-item label="启用销售规则" prop="open">
                <el-switch v-model="salesman.open"/>
            </el-form-item>
            <div v-if="salesman.open">
                <el-form-item label="注册规则" prop="toBeKey">
                    <el-radio-group v-model="salesman.toBeKey">
                        <el-radio label="payMoney">消费条件</el-radio>
                        <el-radio label="chargeMoney" disabled>充值金额</el-radio>
                        <el-radio label="adminCheck">后台审核</el-radio>
                    </el-radio-group>
                </el-form-item>

                <div v-if="salesman.toBeKey === 'payMoney'">
                    <el-form-item label="销售注册后默认角色">
                        <el-select v-model="salesman.defaultRoleId" placeholder="请选择"
                                   @change="defaultRoleIdChange($event)">
                            <el-option
                                    v-for="item in roleArr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                <span style="float: left">{{ item.name }}</span>
                                <span class="ellipsis-1"
                                      style="float: right; color: #8492a6; font-size: 13px;max-width: 180px">{{ item.rebate | roleRebateText}}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="消费级别配置：">
                        <el-table empty-text="未添加任何配置" border :data="salesman.rules">
                            <el-table-column label="消费金额（元）">
                                <template slot-scope="{row}">
                                    <el-input class="edit-input" size="small" v-model="row.money" type="number"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="解锁销售角色">
                                <template slot-scope="{row}">
                                    <el-select v-model="row.roleId" placeholder="请选择" @change="roleChange($event,row)">
                                        <el-option
                                                v-for="item in roleArr"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            <span style="float: left">{{ item.name }}</span>
                                            <span class="ellipsis-1"
                                                  style="float: right; color: #8492a6; font-size: 13px;max-width: 180px">{{ item.rebate | roleRebateText}}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="80px" label="操作">
                                <template slot-scope="{row,$index }">
                                    <el-button type="danger" plain size="mini" @click="del(row,$index )">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="display: flex;justify-content: flex-end">
                            <el-button style="margin: 15px 0" type="success" size="mini" round @click="addRecord">
                                添加级别
                            </el-button>
                        </div>
                    </el-form-item>
                </div>
                <div v-if="salesman.toBeKey === 'chargeMoney'">

                </div>
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
        name: "config-salesman",
        data() {
            return {
                loading: false,
                salesman: {
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
            this.$get("salesman/role/all").then(res => {
                if (res.code === 200) {
                    this.roleArr = res.data;
                }
            });

            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    this.salesman = JSON.parse(res.data.salesman) || {
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
                if (this.salesman.open) {
                    postData = {
                        salesman: JSON.stringify(this.salesman)
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
                if (!this.salesman.rules) this.salesman.rules = [];
                this.salesman.rules.push({
                    roleId: '',
                    money: ''
                })
            },
            del(row, index) {
                this.salesman.rules.splice(index, 1)
            },
        }
    }
</script>

<style scoped>

</style>
