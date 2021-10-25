<template>
    <div style="height: 100%">
        <form-builder style="padding: 10px;background-color: #f9f9f9;border-radius: 5px" :fields="searchFields"
                      :inline="true"
                      submit-name="搜索" @onSubmit="search"/>

        <table-builder :table-data="tableData" :cols="colsData" :total="total">
            <template slot="tableHeader">
                <el-button type="primary" size="mini" plain style="margin: 10px" @click="showEABox()">添加自动回复</el-button>
                <el-button type="default" size="mini" plain style="margin: 10px" @click="autoReplyConf()">自动回复设置
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
        <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false">
            <el-form v-if="showAddBox" ref="form" :rules="addRules" :model="tmpRow" label-width="120px">
                <el-form-item label="回复关键字" prop="keyword">
                    <el-input v-model="tmpRow.keyword"/>
                </el-form-item>
                <el-form-item label="回复内容" prop="reply">
                    <el-input v-model="tmpRow.reply" type="textarea"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveUpdate">{{submitText}}</el-button>
                    <el-button @click="showAddBox = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--自动回复设置-->
        <el-dialog :visible.sync="showConfBox" title="自动回复设置">
            <el-form :model="conf" :rules="confRules" ref="autoReplyForm" label-width="120px"
                     size="small">
                <el-form-item label="无匹配关键字时自动回复内容：" prop="reply" label-width="240px">
                    <el-input
                            :autoSize="true"
                            v-model="conf.reply"
                            type="textarea"
                            placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="关注公众号时欢迎语：" prop="welcome" label-width="240px">
                    <el-input
                            :autoSize="true"
                            v-model="conf.welcome"
                            type="textarea"
                            placeholder="请输入内容"/>
                </el-form-item>

                <el-form-item style="text-align: center" label-width="0">
                    <el-button type="primary" size="mini" @click="saveConf('autoReplyForm')">保存设置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: 'autoReply',
        components: {},
        data() {
            return {
                header: this.$api.header(),
                baseUrl: this.$api.baseUrl,
                // 分页数据
                page: 1,//默认显示第几页
                pageSize: 20,//默认显示多少条每页
                total: 0, // 总记录数
                // 页面结构数据
                tableData: [],
                // 表格字段
                colsData: [
                    {prop: 'keyword', label: '关键字', sortable: false, fixed: false},
                    {prop: 'reply', label: '回复内容', sortable: false, fixed: false},
                ],
                // 搜索表单字段
                searchFields: [
                    {label: '搜索', prop: 'name', type: 'text'},
                ],
                // 查询数据
                queryData: {
                    searchKey: '',
                },
                // 自定义扩展字段
                showArr: [
                    {value: 1, label: '正常回复'},
                    {value: 0, label: '不回复'},
                ],

                // 页面显示数据
                showAddBox: false,
                uploadUrl: this.$api.uploadUrl,
                addRules: {
                    keyword: [{required: true, message: '请输入回复关键字', trigger: 'blur'}],
                    reply: [{required: true, message: '请输入回复内容', trigger: 'blur'}],
                },

                showConfBox: false,
                conf: {
                    reply: '',
                    welcome: ''
                },
                confRules: {
                    subTitle: [{required: true, message: '请输入课程副标题', trigger: 'blur'}],
                },

                imageUrl: '',
                tmpRow: { // 查看、添加的临时变量
                    id: '',
                    keyword: '',
                    reply: '',
                    status: 1,
                },
                editTitle: '添加',
                submitText: '确认添加',
            }
        },
        created() {
            this.getData()
            // 获取供应商
        },
        methods: {
            /**
             * 本页获取数据
             */
            async getData() {
                this.queryData.page = this.page;
                this.queryData.pageSize = this.pageSize;

                let _data = await this.$api.get('auto-reply/list', this.queryData);
                console.log(_data);
                if (_data.code === 200) {
                    this.tableData = _data.data.list;
                    this.total = _data.data.total
                }
            },
            async statusChange(e, row) {
                let postData = {
                    id: row.id,
                    status: e
                };

                console.log(e);
                console.log(row);
                let _res = await this.$api.post("auto-reply", postData);

                if (_res.code === 200) {

                } else if (_res.code === 201) {
                    this.$confirm(_res.msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        row.banner = 0
                    }).catch(() => {

                    });
                }

            },

            // 监听页面改变
            pageChange(e) {
                this.page = e.currentPage;
                this.pageSize = e.pageSize
            },
            search(e) {
                console.log(e);
                this.queryData = e;
                this.getData()
            },
            /**
             * 新增和修改
             * @param e
             * @returns {Promise<void>}
             */
            async saveUpdate() {
                let _api = 'auto-reply';
                console.log(this.tmpRow);
                let _tip;
                let _postData = {};
                if (this.tmpRow.id) {
                    _tip = '修改';
                    _postData = {
                        id: this.tmpRow.id,
                        keyword: this.tmpRow.keyword,
                        reply: this.tmpRow.reply,
                    };
                } else {
                    _tip = '新增';
                    _postData = {
                        keyword: this.tmpRow.keyword,
                        reply: this.tmpRow.reply,
                    }
                }
                let _post = await this.$api.post(_api, _postData);
                if (_post.code === 200) {
                    this.showAddBox = false;
                    this.$message.success(_tip + '成功');
                    this.getData()
                } else {
                    this.$message.error(_post.msg);
                }
            },

            iconUploadSuccess(res) {
                console.log(res);

                if (res.code === '200') {
                    console.log(res);
                    this.tmpRow.icon = res.data.path;
                } else {
                    this.$message.error(res.data.msg);
                }
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
            autoReplyConf() {
                if (!this.conf.reply) {
                    this.$api.get('auto-reply/conf').then(res => {
                        if (res.code === 200) {
                            this.conf = res.data
                        }
                    })
                }
                this.showConfBox = true;

            },
            saveConf(formName) {
                console.log(this.conf);

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.post("auto-reply/conf", this.conf).then(res => {
                            if (res.code === 200) {
                                this.$message.success("配置保存成功");
                                this.showConfBox = false;
                            } else {
                                this.$message.warning(res.msg)
                            }
                        }).catch(err => {
                            this.$message.error("保存信息出错")
                        })
                    } else {
                        return false;
                    }
                });
            },
            showEABox(row = null) {
                console.log(row);
                if (row) {
                    this.tmpRow = row;
                    this.editTitle = '编辑信息';
                    this.submitText = '确认修改';
                } else {
                    this.tmpRow = {name: '', parentId: 0, level: 1};
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
                    this.$api.del('/auto-reply/' + row.id).then(_del => {
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

            exportExcel() {
                this.showExportBox = true
            },
            exportNow() {
                console.log("导出参数", this.exportForm)
                const loading = this.$loading({
                    lock: true,
                    text: '导出中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.2)'
                });
                setTimeout(() => {
                    loading.close();
                }, 6000);
            },
            handleRemove(file, fileList) {
                console.log(file, fileList)
            },
            handlePreview(file) {
                console.log(file)
            }

        }
    }
</script>

<style scoped>
    .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
