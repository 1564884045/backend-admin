<template>
    <div style="height: 100%">
        <form-builder style="padding: 10px;background-color: #f9f9f9;border-radius: 5px" :fields="searchFields"
                      :inline="true"
                      submit-name="搜索" @onSubmit="search"/>

        <table-builder :table-data="tableData" :cols="colsData" :total="total">
            <template slot="tableHeader">
                <el-button type="primary" size="mini" plain style="margin: 10px" @click="showEABox()">新增地区</el-button>
                <el-button type="default" size="mini" plain style="margin: 10px" @click="exportExcel">导出表格</el-button>
            </template>
            <el-table-column label="状态">
                <template slot-scope="{row}">
                    <el-select v-model="row.status" placeholder="请选择" @change="statusChange($event,row)">
                        <el-option
                                v-for="item in publishStatusArr"
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
            <form-builder :fields="searchFields" v-if="showAddBox" :default-value="tmpRow"
                          submit-name="提交" @onSubmit="saveUpdate"/>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'areaList',
        components: {},
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
                    {prop: 'name', label: '地区', sortable: false, fixed: false},
                ],
                // 搜索表单字段
                searchFields: [
                    {label: '地区', prop: 'name', type: 'text'},
                ],
                // 查询数据
                queryData: {},
                // 自定义扩展字段
                publishStatusArr: [
                    {value: 1, label: '显示'},
                    {value: 0, label: '隐藏'},
                ],

                // 页面显示数据
                showAddBox: false,
                uploadUrl: this.$api.uploadUrl,

                imageUrl: '',
                tmpRow: { // 查看、添加的临时变量
                    id: '',
                    parentId: '',
                    name: '',
                    showStatus: 1,
                    level: 1
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

                this.$api.get('area/list', this.queryData)
                    .then(_data => {
                        console.log(_data)
                        if (_data.code === 200) {
                            this.tableData = _data.data.list;
                            this.total = _data.data.total
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error(err.msg);
                    });

            },
            async statusChange(e, row) {
                let postData = {
                    id: row.id,
                    status: e
                };
                console.log(e);
                console.log(row);
                this.$api.post("area", postData).then(_res => {
                    if (_res.code !== 200) {
                        this.$message.error(_res.msg);
                        this.getData();
                    }
                }).catch(err => {
                    console.log(err)
                })

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
            async saveUpdate(e) {
                console.log(e);
                if (e && !e.name) return this.$message.error("请填写区域名");
                let _tip;
                if (e.id) {
                    _tip = '修改';
                } else {
                    _tip = '新增';
                }


                this.$api.post('area', e).then(_post => {
                    if (_post.code === 200) {
                        this.showAddBox = false;
                        this.$message.success(_tip + '成功');
                        this.getData()
                    } else {
                        this.$message.warning(_post.msg);
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error(err.msg);

                })

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
                    this.$api.del('/area/' + row.id).then(_del => {
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
                    }).catch(() => {
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
