<template>
    <div style="margin-top: 50px">
        <el-form :model="value" ref="productAttrForm" label-width="120px" size="small">
            <el-form-item label="图文详情：">
                <quill-editor :header="header" v-model="detail"/>
            </el-form-item>
            <el-form-item style="text-align: center" label-width="0">
                <el-button size="mini" @click="handlePrev">上一步，填写商品促销</el-button>
                <el-button type="primary" size="mini" @click="handleNext">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import QuillEditor from "@/components/Quill"

    export default {
        name: "ProductAttrDetail",
        components: {QuillEditor},
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                header: this.$api.header(),
                detail: ''
            }
        },
        computed: {},
        created() {
        },
        watch: {
            value: function (val) {
                if (val) {
                    setTimeout(()=>{
                        if (val.detail) this.detail = val.detail;
                        else this.detail = '';
                    },200)
                }
            }
        },
        methods: {

            handlePrev() {
                this.$emit('prevStep')
            },
            handleNext() {
                if (!this.detail) return this.$message.error("请输入内容详情");
                this.value.detail = this.detail;
                this.$emit('nextStep', 'end')
            }
        }
    }
</script>

<style scoped>

</style>
