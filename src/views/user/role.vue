<template>
    <div style="height: 100%">
        <div class="flex ptb-10 align-center">
            <div class="w-50 flex justify-start">
                <el-button icon="el-icon-plus" type="primary" @click="showEABox()">
                    添加
                </el-button>
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

        <table-builder :table-data="tableData" :cols="colsData" :total="total">
            <el-table-column label="跟进销售" v-if="$hasVip('salesman')">
                <template slot-scope="{row}">
                    <el-button :type="row.followSaleName?'success':'info'" plain size="mini" @click="sales(row)">
                        {{ row.followSaleName ? row.followSaleName : '未指定' }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="{row}">
                    <el-select v-model="row.status" placeholder="请选择" @change="statusChange($event,row)">
                        <el-option
                            v-for="item in statusArr"
                            :key="item.value"
                            :disabled="item.disable"
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
            <el-form ref="form" v-if="showAddBox" :model="tmpRow" label-width="80px">
                <el-form-item label="封面图标">
                    <image-upload :action="baseUrl" v-model="tmpRow" field="icon"/>
                </el-form-item>
                <el-form-item label="键名">
                    <el-input v-model="tmpRow.key" :disabled="tmpRow.id" placeholder="用以判断角色类型的键名（唯一）"/>
                </el-form-item>
                <el-form-item label="角色名">
                    <el-input v-model="tmpRow.name"/>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="tmpRow.sort" type="number" placeholder="越大越靠前"/>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" v-model="tmpRow.intro" placeholder="简单介绍该角色特点"/>
                </el-form-item>
            </el-form>
            <el-button @click="saveUpdate(tmpRow)">{{submitText}}</el-button>
        </el-dialog>
    </div>
</template>

<script>

    import ImageUpload from "../../components/ImageUpload/index";

    export default {
        components: {ImageUpload},
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
                    {prop: 'name', label: '角色名', sortable: false, fixed: false},
                    {
                        prop: 'icon', label: '图标', sortable: false, fixed: false, type: 'img',
                        pipe: (val) => {
                            if (val && val.indexOf("http") > -1) return val;

                            console.log(this.$baseUrl + val)
                            return this.$baseUrl + val
                        }
                    },
                    {prop: 'intro', label: '简介', sortable: false, fixed: false},
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
                    {value: 0, label: '暂停使用'},
                ],

                // 页面显示数据
                showAddBox: false,
                uploadUrl: this.$api.uploadUrl,

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
            this.baseUrl = this.$baseUrl + '/upload/' + this.$store.state.shop.id + '/icon';
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

                let _data = await this.$api.get('user/role/list', this.queryData);
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
                let _res = await this.$post("user/role", postData);
                if (_res.code !== 200) {
                    this.$message.error(_res.msg);
                    this.getData();
                }
            },

            // 监听页面改变
            pageChange(e) {
                this.page = e.currentPage;
                this.pageSize = e.pageSize
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
                if (e && e.id) {
                    _tip = '修改';
                } else {
                    _tip = '新增';
                }
                let _post = await this.$api.post('user/role', e);
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
                    this.$api.del('/user/role/' + row.id).then(_del => {
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
</style>
