<template>
    <div style="margin-top: 50px">
        <el-form :model="value" ref="productAttrForm" label-width="120px" size="small">
            <el-form-item label="图文详情：">
                <quill-editor :header="header" v-model="value.detail"/>
            </el-form-item>
            <el-form-item style="text-align: center" label-width="0">
                <el-button size="mini" @click="handlePrev">上一步</el-button>
                <el-button type="primary" size="mini" @click="handleNext">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import QuillEditor from "@/components/Quill"

    export default {
        name: "step4",
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
            }
        },
        computed: {},
        created() {
        },
        watch: {

        },
        methods: {
            handlePrev() {
                this.$emit('prevStep')
            },
            handleNext() {
                if (!this.value.detail) return this.$message.error("请输入内容详情");
                this.$emit('nextStep', 'end')
            }
        }
    }
</script>

<style scoped>

</style>
