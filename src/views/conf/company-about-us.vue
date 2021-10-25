<template>
    <!--  图文配置  -->
    <el-card class="box-card" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.9)">
        <div slot="header" class="clearfix">
            <el-row>
                <el-col :span="12">
                    <span>关于我们</span>
                </el-col>
                <el-col :span="12" class="flex justify-end">
                    <el-button size="mini" type="primary" @click="saveConf">保存</el-button>
                </el-col>
            </el-row>
        </div>

        <quill v-model="detail" field="aboutUs"></quill>

    </el-card>
</template>

<script>

    import ImagesUpload from "@/components/ImagesUpload";
    import quill from "@/components/Quill/quill";

    export default {
        name: "config-poster",
        components: {ImagesUpload, quill},
        data() {
            return {
                loading: false,
                detail: {
                    aboutUs: ''
                }
            }
        },
        created() {
            this.detail.aboutUs = this.$store.state.shop.aboutUs
        },
        methods: {
            saveConf() {
                let conf = {
                    aboutUs: this.detail.aboutUs
                };
                this.$api.post("company", conf).then(ret => {
                    if (ret.code === 200) {
                        this.$message.success(ret.msg);
                        this.$store.dispatch("setShopInfo");
                    } else
                        this.$message.error(ret.msg);
                })
            },
        }
    }
</script>

<style scoped>

</style>
