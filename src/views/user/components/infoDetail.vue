<template>
    <div style="margin-top: 50px">
        <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px"
                 size="small">
            <el-form-item label="课程分类：" prop="categoryId">
                <el-select
                        v-model="value.categoryId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="getProductCateList"
                        :loading="categoryLoading">
                    <el-option
                            v-for="item in productCateOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="课程标题：" prop="title">
                <el-input v-model="value.title"/>
            </el-form-item>
            <el-form-item label="副标题：" prop="subTitle">
                <el-input v-model="value.subTitle"/>
            </el-form-item>
            <el-form-item label="课程介绍：" prop="description">
                <el-input
                        :autoSize="true"
                        v-model="value.description"
                        type="textarea"
                        placeholder="请输入内容"/>
            </el-form-item>

            <el-form-item label="单价：">
                <el-input v-model="value.price" type="number"/>
            </el-form-item>
            <el-form-item label="单位：">
                <el-input v-model="value.unit" type="text"/>
            </el-form-item>
            <el-form-item label="原价：">
                <el-input v-model="value.originalPrice" type="number"/>
            </el-form-item>
            <el-form-item label="课程咨询电话：">
                <el-input v-model="value.phone" type="text" placeholder="可选"/>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="value.sort" type="number"/>
            </el-form-item>
            <el-form-item style="text-align: center" label-width="0">
                <el-button type="primary" size="mini" @click="handleNext('productInfoForm')">下一步，填写信息</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "ProductInfoDetail",
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                hasEditCreated: false,
                //选中商品分类的值
                selectProductCateValue: [],
                productCateOptions: [],
                categoryLoading: false,
                brandOptions: [],
                rules: {
                    title: [
                        {required: true, message: '请输入课程名称', trigger: 'blur'},
                        {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                    ],
                    subTitle: [{required: true, message: '请输入课程副标题', trigger: 'blur'}],
                    categoryId: [{required: true, message: '请选择课程分类', trigger: 'blur'}],
                    description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
                    requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
                }
            };
        },
        created() {
            this.getProductCateList();
            this.getBrandList();
        },
        computed: {
            //商品的编号
            productId() {
                return this.value.id;
            }
        },
        watch: {
            productId: function (newValue) {
                if (!this.isEdit) return;
                if (this.hasEditCreated) return;
                if (newValue === undefined || newValue == null || newValue === 0) return;
            },
            selectProductCateValue: function (newValue) {
                console.log(newValue);
                if (newValue != null) {
                    this.value.categoryId = newValue;
                } else {
                    this.value.categoryId = null;
                }
            }
        },
        methods: {
            getProductCateList(key = '') {
                console.log(key)
                this.categoryLoading = true;
                this.$api.get("course/category/list", {
                    page: 1, pageSize: 10, name: key
                }).then(res => {
                    if (res.code === 200)
                        this.productCateOptions = res.data.list;
                    this.categoryLoading = false
                }).catch(err => {
                    this.categoryLoading = false
                })

            },
            getBrandList() {

            },
            getCateNameById(id) {
                let name = null;
                for (let i = 0; i < this.productCateOptions.length; i++) {
                    for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
                        if (this.productCateOptions[i].children[j].value === id) {
                            name = this.productCateOptions[i].children[j].label;
                            return name;
                        }
                    }
                }
                return name;
            },
            handleNext(formName) {

                console.log(this.value)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('nextStep');
                    } else {
                        return false;
                    }
                });
            },
            handleBrandChange(val) {
                let brandName = '';
                for (let i = 0; i < this.brandOptions.length; i++) {
                    if (this.brandOptions[i].value === val) {
                        brandName = this.brandOptions[i].label;
                        break;
                    }
                }
                this.value.brandName = brandName;
            }
        }
    }
</script>

<style scoped>
</style>
