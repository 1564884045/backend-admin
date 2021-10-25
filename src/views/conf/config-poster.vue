<template>
    <!--  图文配置  -->
    <el-card class="box-card" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.9)">
        <div slot="header" class="clearfix"><span>分享图文</span>
        </div>
        <el-form ref="form" :model="shareInfo" label-width="260px">
            <el-form-item label="分享默认标题" prop="accessKey">
                <el-input type="text" v-model="shareInfo.title"
                          placeholder="页面未设置分享时默认的分享标题"/>
            </el-form-item>

            <el-form-item label="封面展示（默认分享图片）：">
                <image-upload v-model="shareInfo" field="cover" :action="uploadUrl"/>
            </el-form-item>
            <el-form-item label="logo：">
                <images-upload v-model="shareInfo" field="logos" :action="uploadUrl"/>
            </el-form-item>
            <el-form-item label="海报图片集：">
                <images-upload :max="6" v-model="shareInfo" field="posterArr" :action="uploadUrl"/>
            </el-form-item>
            <el-form-item>
                <el-alert title="修改后点击下方保存按钮生效" type="info" show-icon :closable="false"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">立即保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>

import ImagesUpload from "@/components/ImagesUpload";

export default {
    name: "config-poster",
    components: {ImagesUpload},
    data() {
        return {
            loading: false,
            shareInfo: {
                cover: "",
                logos: [],
                posterArr: [],
                title: "",
            },
            uploadUrl: '',
            dialogImageUrl: '',
            dialogVisible: false,
            uploadFileList: []
        }
    },
    created() {
        this.uploadUrl = this.$api.baseUrl + '/upload/' + this.$store.state.shop.id + '/share';
        this.loading = true;
        this.$api.get("company/conf").then(res => {
            if (res.code === 200) {
                this.shareInfo = JSON.parse(res.data.shareInfo) || {
                    cover: "",
                    logo: "",
                    posterArr: [],
                    title: "",
                };
                if (this.shareInfo && this.shareInfo.posterArr) {
                    let _pathArr = this.shareInfo.posterArr || [];
                    let _showList = [];
                    _pathArr.forEach(item => {
                        _showList.push({
                            url: this.$api.baseUrl + item,
                            path: item
                        })
                    });
                    this.uploadFileList = _showList;
                }
            }
            this.loading = false;
        }).catch(err => {
            this.loading = false;
        })

    },
    methods: {
        save() {
            let _list = this.$refs.uploadPoster.uploadFiles;
            console.log(_list);
            let _pathArr = [];
            _list.forEach(item => {
                let res = item.response;
                if (res && 200 === Number.parseInt(res.code)) {
                    _pathArr.push(res.data.path)
                } else {
                    _pathArr.push(item.path)
                }
            });
            this.shareInfo.posterArr = _pathArr;
            console.log(this.shareInfo);

            let postData = {
                shareInfo: JSON.stringify(this.shareInfo)
            };
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
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }
}
</script>

<style scoped>

</style>
