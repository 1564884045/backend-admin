<template>
    <el-card class="form-container" shadow="never">
        <el-steps :active="step -1" finish-status="success" align-center>
            <el-step title="填写基本信息"/>
            <el-step title="填写信息"/>
            <el-step title="填写详情"/>
        </el-steps>
        <product-info-detail
                v-show="step === 1"
                v-model="productParam"
                :is-edit="visible"
                @nextStep="nextStep">
        </product-info-detail>
        <product-sale-detail
                v-show="step === 2"
                v-model="productParam"
                :is-edit="visible"
                @nextStep="nextStep"
                @prevStep="prevStep">
        </product-sale-detail>
        <product-attr-detail
                v-show="step === 3"
                v-model="productParam"
                :is-edit="visible"
                @nextStep="nextStep"
                @prevStep="prevStep">
        </product-attr-detail>
    </el-card>
</template>
<script>
    import ProductInfoDetail from './infoDetail';
    import ProductSaleDetail from './saleDetail';
    import ProductAttrDetail from './attrDetail';

    export default {
        name: 'ProductDetail',
        components: {ProductInfoDetail, ProductSaleDetail, ProductAttrDetail},
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            detailId: {
                type: null,
                default: function () {
                    return null;
                }
            }
        },
        data() {
            return {
                productParam: {},
                step: 1,
            }
        },
        created() {
            if (this.detailId) this.getDetail(this.detailId);
        },
        watch: {
            // detailId: function (val) {
            //     if (val) this.getDetail(val)
            // },
            visible(val) {
                if (!val) this.refreshData();
                if (val && this.detailId) this.getDetail(this.detailId)
            }
        },
        methods: {
            async getDetail(id) {
                console.log(id);
                let detail = await this.$api.get("course/" + id);
                if (detail.code === 200) {
                    this.productParam = detail.data;

                    let banner = JSON.parse(detail.data.banner);
                    let plan = JSON.parse(detail.data.plan);
                    let _b = [];
                    banner.forEach(item => {
                        _b.push({
                            path: item,
                            url: this.$api.baseUrl + item,
                        })
                    });
                    this.productParam.banner = _b;
                    this.productParam.plan = plan;

                } else {
                    this.$message.error(detail.msg)
                }
            },
            refreshData() {

                this.productParam = {};
                this.step = 1;
            },

            prevStep() {
                if (this.step > 1) {
                    this.step -= 1;
                }

            },
            nextStep(e) {
                console.log(e);
                if (e === 'end') {
                    if (this.detailId) this.productParam.id = this.detailId;
                    this.$emit("ok", this.productParam);
                    return;
                }
                this.step += 1;
            },
        }
    }
</script>
<style>

</style>


