<template>
    <div style="margin-top: 50px">
        <el-form :model="value" ref="productSaleForm" label-width="120px" size="small">
            <el-form-item label="课程封面：">
                <el-upload
                        ref="uploadCover"
                        name="file"
                        class="article-cover"
                        :action="this.$api.baseUrl + '/upload/cover'"
                        :show-file-list="false"
                        :on-success="coverUploadSuccess"
                        :before-upload="beforeImageUpload">
                    <el-image v-if="cover" fit="contain" :src="cover" class="avatar" alt=""
                              style="width: 280px;height: 120px;"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 280px;height: 120px;"/>
                </el-upload>
            </el-form-item>
            <el-form-item label="课程图片：">
                <el-col :span="24">
                    <el-upload class="upload-demo" drag
                               name="file"
                               :show-file-list="false"
                               :headers="header"
                               :action="this.$api.baseUrl + '/upload/banner'"
                               :on-success="bannerUploadSuccess"
                               :before-upload="beforeImageUpload"
                               multiple>
                        <i class="el-icon-upload"/>
                        <div class="el-upload__text">将图片[jpg/png]拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-col>
                <el-col style=" margin:0 5px" v-show="0<images.length < 6" :span="5" class="goods-image"
                        v-for="(img,index) in images"
                        :key="index">
                    <el-image style="width: 100px; height: 100px;"
                              :src="img.url"
                              fit="fill" :preview-src-list="[img.url]">
                    </el-image>
                    <div style="display: flex;justify-content: center">
                        <i class="el-icon-circle-close del-icon" @click="delImage(img.id)"/>
                    </div>
                </el-col>
            </el-form-item>
            <el-form-item label="课程安排：">
                <el-row style="width: 100%;padding-top: 5px;" v-for="(item,index) in plan" :key="index">
                    <el-col :span="8">
                        <el-input placeholder="请输入安排名称" v-model="item.k"/>
                    </el-col>
                    <el-col :span="16">
                        <el-input placeholder="请输入内容" v-model="item.v">
                            <template slot="append"><i class="el-icon-delete text-red" @click="delPlan(index)"/>
                            </template>
                        </el-input>
                    </el-col>

                </el-row>

                <el-button class="padding-sm" type="primary" size="mini" round @click="addPlan">
                    添加条件
                </el-button>
            </el-form-item>
            <el-form-item v-if="false" prop="house_direction" label="商品关键字：">
                <el-tag :key="tag" style="margin-right: 5px"
                        v-for="tag in keywordsArr"
                        closable
                        :disable-transitions="false"
                        @close="closeKeyWord(tag)">
                    {{tag}}
                </el-tag>
                <el-input class="input-new-tag" style="width: 100px;"
                          v-if="keywordsInputVisible"
                          v-model="keywordsInputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="keywordsInputConfirm"
                          @blur="keywordsInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
            </el-form-item>
            <el-form-item label="商品备注：">
                <el-input v-model="value.note" type="textarea" :autoSize="true"></el-input>
            </el-form-item>

            <el-form-item style="text-align: center" label-width="0">
                <el-button size="mini" @click="handlePrev">上一步，填写基本信息</el-button>
                <el-button type="primary" size="mini" @click="handleNext">下一步，填写课程详情</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "ProductSaleDetail",
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

                //日期选择器配置
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                keywordsArr: [],
                keywordsInputVisible: false,
                keywordsInputValue: "",
                images: [],
                cover: '',
                plan: [ // 课程安排
                    {k: '类型', v: ''},
                    {k: '授课方式', v: ''},
                    {k: '课时', v: ''},
                    {k: '上课时间', v: ''},
                ],
            }
        },
        created() {

        },
        computed: {},
        watch: {
            value: function (val) {
                if (val) {
                    if (val.banner) this.images = val.banner;
                    else this.images = [];
                    if (val.plan) this.plan = val.plan;
                    else this.plan = [
                        {k: '类型', v: ''},
                        {k: '授课方式', v: ''},
                        {k: '课时', v: ''},
                        {k: '上课时间', v: ''},
                    ];
                    if (val.cover) this.cover = this.$api.baseUrl + val.cover;
                    else this.cover = '';
                }
            },
        },
        methods: {
            coverUploadSuccess(res) {
                console.log(res);

                if (res.code === '200') {
                    console.log(res);
                    this.cover = res.data.url;
                    this.value.cover = res.data.path;
                } else {
                    this.$message.error(res.data.msg);
                }
            },
            bannerUploadSuccess(res) {
                console.log(res);
                if (res.code === '200') {
                    this.images.push({
                        path: res.data.path,
                        url: res.data.url,
                    });
                } else {
                    this.$message.error(res.msg);
                }
            },
            delImage(i) {
                this.images.splice(i, 1)
            },
            beforeImageUpload(file) {
                console.log(file);
                const isJPG = file.type === ('image/jpeg' || 'image/png' || 'image/jpg');
                const isLt2M = file.size / 1024 / 1024 < 2;
                console.log(isJPG);
                if (!isJPG)
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                if (!isLt2M)
                    this.$message.error('上传图片大小不能超过 2MB!');
                return isJPG && isLt2M;
            },
            delPlan(i) {
                this.plan.splice(i, 1)
            },
            addPlan() {
                this.plan.push({
                    v: '',
                    k: ''
                })
            },
            handlePrev() {
                this.value.plan = this.plan;
                this.$emit('prevStep');
                // 封面
                let _path = [];
                this.images.forEach(item => {
                    _path.push(item.path)
                });
                this.value.banner = _path;
            },
            handleNext() {
                this.value.plan = this.plan;
                if (!this.cover) return this.$message.error("请上传封面图片");
                if (this.images.length === 0) return this.$message.error("请至少上传一张课程图片");
                // 封面
                let _path = [];
                this.images.forEach(item => {
                    _path.push(item.path)
                });
                this.value.banner = _path;
                this.$emit('nextStep')
            },
            closeKeyWord(tag) {
                this.keywordsArr.splice(this.keywordsArr.indexOf(tag), 1);
            },
            keywordsInputConfirm() {
                if (this.keywordsInputValue) {
                    this.keywordsArr.push(this.keywordsInputValue);
                }
                this.keywordsInputVisible = false;
                this.keywordsInputValue = '';
            },

        }
    }
</script>

<style scoped>
    /deep/ .el-upload-dragger {
        width: 280px;
        height: 120px;
    }

    /deep/ .el-icon-upload {
        margin: 0;
    }

    .avatar-uploader-icon {

        line-height: 120px;
        font-size: 20px;
        color: #cecece;
        border: 1px dashed #cecece;
        border-radius: 8px;
    }
</style>
