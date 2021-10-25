<template>
    <div style="max-width: 1000px;margin: auto">
        <!--    客服配置    -->
        <table-builder :cols="adCols" :table-data="bannerList" :show-pagination="false">
            <template slot="tableHeader">
                <el-button type="primary" size="mini" plain style="margin: 10px" @click="showEABox(null,'category')">
                    添加分类
                </el-button>
            </template>
            <el-table-column label="显示">
                <template slot-scope="{row}">
                    <el-select v-model="row.status" placeholder="请选择" @change="statusChange($event,row)">
                        <el-option
                                v-for="item in showArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button type="primary" plain size="mini" @click="showEABox(row)">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
                </template>
            </el-table-column>
        </table-builder>

        <!--  弹窗 //新增 编辑 -->

        <!--  弹窗 //新增 编辑 -->
        <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false">
            <el-form v-if="showAddBox" ref="form" :rules="rules" :model="tmpRow" label-width="150px">
                <el-form-item label="跳转方式" prop="toType">
                    <el-radio-group v-model="tmpRow.toType" @change="refreshTmpRow">
                        <el-radio label="productCategory">产品分类</el-radio>
                        <el-radio label="article">系统文章</el-radio>
                        <el-radio label="artCourseCategory">附近的</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转商品分类" prop="target" v-show="tmpRow.toType === 'productCategory'">
                    <remote-select api="product/category/list" show-label="name" v-model="tmpRow" field="target"
                                   @changeObj="selectChange"
                                   v-if="tmpRow.toType === 'productCategory'"/>
                </el-form-item>
                <el-form-item label="跳转分类" prop="target" v-show="tmpRow.toType === 'gradeCourseCategory'">
                    <remote-select api="course/category/list?type=grade" show-label="name" field="target"
                                   v-model="tmpRow"
                                   @changeObj="selectChange"
                                   v-if="tmpRow.toType === 'gradeCourseCategory'"/>
                </el-form-item>
                <el-form-item label="跳转分类" prop="target" v-show="tmpRow.toType === 'artCourseCategory'">
                    <remote-select api="course/category/list?type=art" show-label="name" field="target" v-model="tmpRow"
                                   @changeObj="selectChange"
                                   v-if="tmpRow.toType === 'artCourseCategory'"/>
                </el-form-item>

                <el-form-item label="标题" prop="title">
                    <el-input v-model="tmpRow.title"/>
                </el-form-item>

                <el-form-item label="封面" prop="cover" v-show="tmpRow.toType && tmpRow.toType !== ''">
                    <image-upload v-model="tmpRow" :action="baseUrl + '/upload/home/category'" field="cover"/>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="saveUpdate">{{ submitText }}</el-button>
                    <el-button @click="showAddBox = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    const toTypeArr = {
        course: "课程详情",
        product: "产品详情",
        gradeCourseCategory: "义务教育课程分类",
        artCourseCategory: "艺术课程分类",
        productCategory: "产品分类",
        task: "活动详情",
        url: '外链',
        article: '文章',
        notice: '公告',
    };
    export default {
        name: "ad",
        data() {
            return {
                showArr: [
                    {value: 1, label: '显示'},
                    {value: 0, label: '不显示'},
                ],
                // 页面显示数据
                showAddBox: false,
                baseUrl: this.$api.baseUrl,
                tmpRow: {
                    target: '',
                    toType: '',
                    cover: '',
                    title: '',
                    position: '',
                },
                editTitle: "",
                submitText: "",

                adCols: [
                    {prop: 'title', label: '标题', sortable: false, fixed: false},
                    {
                        prop: 'toType', label: '跳转类型', sortable: false, fixed: false,
                        pipe: function (res) {
                            let text = toTypeArr[res];
                            if (text) return text;
                            return "";
                        }
                    },
                ],

                bannerList: [],

                rules: {
                    title: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    toType: [{required: true, message: '请选择打开方式', trigger: 'blur'}],
                    target: [{required: true, message: '请选择', trigger: 'blur'}],
                    cover: [{required: true, message: '请选择上传封面', trigger: 'blur'}],
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$api.get("company/home/list", {position: 'category'}).then(res => {
                    if (res.code === 200) {
                        this.bannerList = res.data.list;
                    }
                })
            },
            selectChange(e) {
                console.log(e);
                this.tmpRow.cover = e.icon;
                this.tmpRow.title = e.name;
            },

            /**
             * 状态修改
             */
            async statusChange(e, row) {
                let postData = {
                    id: row.id,
                    status: e
                };
                this.saveData(postData, "修改")
            },
            /**
             * 保存或者更新
             */
            async saveUpdate() {
                console.log(this.tmpRow);
                let _tip;
                let _postData = this.tmpRow;
                if (this.tmpRow.id) _tip = '修改';
                else _tip = '新增';

                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.saveData(_postData, _tip);
                    } else {
                        return false;
                    }
                });
            },
            /**
             * 保存动作
             * @param postData
             * @param tip
             */
            saveData(postData, tip) {
                this.$api.post('company/home', postData).then(_post => {
                    if (_post.code === 200) {
                        this.showAddBox = false;
                        this.$message.success(tip + '成功');
                        this.getData()
                    } else {
                        this.$message.error(_post.msg);
                    }
                }).catch(err => {
                    this.$message.error("网络请求失败");
                })
            },
            refreshTmpRow(e) {
                this.tmpRow.target = ''
            },
            showEABox(row = null, position) {
                console.log(row);
                if (row) {
                    this.tmpRow = row;
                    this.editTitle = '编辑信息';
                    this.submitText = '确认修改';
                } else {
                    this.tmpRow = {
                        target: '',
                        toType: '',
                        cover: '',
                        title: '',
                        position: position,
                    };
                    this.editTitle = '新增';
                    this.submitText = '提交';
                }
                this.showAddBox = true;
            },

            del(row) {
                this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.del('company/home/' + row.id).then(_del => {
                        if (_del.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除删除失败'
                            })
                        }
                    }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: '删除删除失败'
                        })
                    })

                }).catch(() => {

                })
            },

        }

    }
</script>

<style scoped>
    .el-card {
        margin-bottom: 10px;
    }

    .el-input {
        margin-bottom: 10px;
    }

    .el-button {
        float: right;
        margin: 0 10% 10px;
    }

    >>> .el-card__body {
        padding: 20px 100px 20px 60px;
    }
</style>
