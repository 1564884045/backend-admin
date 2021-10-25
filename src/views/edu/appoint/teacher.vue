<template>
    <div style="height: 100%">
        <div class="flex ptb-10 align-center">
            <div class="w-50 flex justify-start">
            </div>
            <div class="w-50 flex justify-end">
                <el-form class="align-center flex" :inline="true" :model="queryData" @submit.native.prevent>
                    <el-input class="mlr-10"
                              v-model.trim="queryData.searchKey"
                              placeholder="请输入查询条件"
                              clearable
                    />
                    <el-button icon="el-icon-search" type="primary" @click="search">
                        查询
                    </el-button>
                </el-form>
            </div>
        </div>

        <table-builder @pageChange="pageChange" :table-data="tableData" :cols="colsData" :total="total">
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button type="primary" plain size="mini" @click="showEABox(row)">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
                </template>
            </el-table-column>
        </table-builder>
    </div>
</template>

<script>
    // public static final int STATUS_UN_DO = 1; // 待处理
    // public static final int STATUS_UN_DONE = 2; // 待完成
    // public static final int STATUS_DONE = 3; // 已完成
    // public static final int STATUS_CANCEL = 4; // 已取消
    export default {
        name: 'teacherAppoint',
        data() {
            return {
                // 分页数据
                page: 1,//默认显示第几页
                pageSize: 20,//默认显示多少条每页
                total: 0, // 总记录数
                // 页面结构数据
                tableData: [],
                // 表格字段
                colsData: [
                    {
                        prop: 'fabuUser', label: '发布人', sortable: false, fixed: false,
                        pipe: function (val) {
                            if (val) return val.name
                        }
                    },{
                        prop: 'yyUser', label: '预约人', sortable: false, fixed: false,
                        pipe: function (val) {
                            if (val) return val.name || '未设置姓名'
                        }
                    },{
                        prop: 'yyUser', label: '预约人电话', sortable: false, fixed: false,
                        pipe: function (val) {
                            if (val) return val.phone || '未设置电话'
                        }
                    },
                    {prop: 'areaText', label: '预约区域', sortable: false, fixed: false,pipe:(val)=>{return val.join(",")}},
                    {prop: 'subjectText', label: '预约科目', sortable: false, fixed: false,pipe:(val)=>{return val.join(",")}},
                    {prop: 'stageText', label: '预约阶段', sortable: false, fixed: false,pipe:(val)=>{return val.join(",")}},
                    {prop: 'createTime', label: '预约时间', sortable: false, fixed: false},
                ],
                // 搜索表单字段
                searchFields: [
                    {label: '搜索', prop: 'searchKey', type: 'text'},
                ],
                // 查询数据
                queryData: {},
                // 自定义扩展字段
                statusArr: [
                    {value: 1, label: '正常使用'},
                    {value: 0, label: '禁止登录'},
                ],

                // 页面显示数据
                showAddBox: false,
                uploadUrl: this.$api.uploadUrl,

                imageUrl: '',
                tmpRow: { // 查看、添加的临时变量
                    id: '',
                    followSaleName: '',
                    name: '',
                    showStatus: 1,
                    level: 1
                },
                editTitle: '添加',
                submitText: '确认添加',

                showImBox: false,

                showAddressBox: false,

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
                this.queryData.target = 'teacher';

                let _data = await this.$api.get('appoint/list', this.queryData);
                console.log(_data)
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
                let _res = await this.$api.post("appoint", postData);
                if (_res.code !== 200) {
                    this.$message.error(_res.msg);
                    this.getData();
                }
            },

            // 监听页面改变
            pageChange(e) {
                console.log(e)
                this.page = e.page;
                this.pageSize = e.pageSize;
                this.getData()
            },
            search() {
                this.page = 1;
                this.getData()
            },
            /**
             * 新增和修改
             * @param e
             * @returns {Promise<void>}
             */
            async saveUpdate(e) {
                console.log(e);
                let _tip;
                if (e.id) {
                    _tip = '修改';
                } else {
                    _tip = '新增';
                }
                let _post = await this.$api.post('appoint', e);
                if (_post.code === 200) {
                    this.showAddBox = false;
                    this.showSalesmanBox = false;
                    this.$message.success(_tip + '成功');
                    this.getData()
                } else {
                    this.$message.error(_post.msg);
                }
            },
            sales(row) {
                this.tmpRow = row;
                this.showSalesmanBox = true;
                this.getSalesData()
            },
            searchSales(e) {
                this.querySalesData = e;
                this.getSalesData()
            },
            selectSalesChange(e) {
                console.log(e);
                let saveData = {
                    id: this.tmpRow.id,
                    followSale: e.userId
                }
                this.saveUpdate(saveData);
            },
            async getSalesData() {
                this.querySalesData.page = 1;
                this.querySalesData.pageSize = 20;
                let _data = await this.$api.get('salesman/list', this.querySalesData);
                console.log(_data)
                if (_data.code === 200) {
                    this.salesmanList = _data.data.list;
                }
            },

            showEABox(row = null) {
                console.log(row);
                if (row) {
                    this.tmpRow = row;
                    this.editTitle = '编辑';
                    this.submitText = '确认修改';
                } else {
                    this.tmpRow = {name: '', parentId: 0, level: 1};
                    this.editTitle = '新增';
                    this.submitText = '提交';
                }
                this.showAddBox = true;
            }
            ,
            showRealName(row) {
                console.log(row)
            },

            im(row) {
                this.showImBox = true;
                this.tmpRow = row;
            }
            ,
            address(row) {
                this.showAddressBox = true;
                this.tmpRow = row;
            }
            ,

            del(row) {
                this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.del('/appoint/' + row.id).then(_del => {
                        if (_del.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除失败'
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
            }
            ,

            exportExcel() {
                this.showExportBox = true
            }
            ,
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
            }
            ,
            handleRemove(file, fileList) {
                console.log(file, fileList)
            }
            ,
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

    /deep/ .chat-box .el-dialog__body {
        padding: 0;
    }

    /deep/ .chat-box .el-dialog__header {
        background-color: #000000;
    }

    /deep/ .chat-box .el-dialog__header .el-dialog__title {
        color: #FFF;
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

    /deep/ .el-drawer__header {
        margin-bottom: 5px
    }
</style>
