<template>
    <div style="height: 100%">
        <div class="flex ptb-10 align-center">
            <div class="w-50 flex justify-start">
                <div class="w-50">
                    <el-button icon="el-icon-plus" type="primary" @click="showEABox(null,false)">
                        添加
                    </el-button>
                </div>
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
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button type="primary" plain size="mini" @click="showEABox(row)">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
                </template>
            </el-table-column>
        </table-builder>

        <!--  弹窗 //新增 编辑 -->
        <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false">
            <el-form v-if="showAddBox" ref="form" :model="tmpRow" label-width="150px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="tmpRow.name"/>
                </el-form-item>
                <el-form-item label="简介（可选）" prop="intro">
                    <el-input type="textarea" v-model="tmpRow.intro"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveUpdate(tmpRow)">{{ submitText }}</el-button>
                    <el-button @click="showAddBox = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'moneyList',
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
                    {prop: 'name', label: '薪资', sortable: false, fixed: false},
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

                tmpRow: { // 查看、添加的临时变量
                    id: '',
                    followSaleName: '',
                    name: '',
                    showStatus: 1,
                    level: 1
                },
                editTitle: '添加',
                submitText: '确认添加',
            }
        },
        created() {
            console.log(this.$store.state.shop);

            if (this.$hasConf('config', 'realName')) {
                let _realName = [
                    {value: 2, label: '未实名', disable: true},
                    {value: 3, label: '已提交实名材料', disable: true},
                ];
                this.statusArr = this.statusArr.concat(_realName);
            }
            if (this.$hasVip('rebate'))
                this.colsData.push({
                    prop: 'totalRebateMoney', label: '返利余额(元)', align: 'center', sortable: false, fixed: false,
                    pipe: function (val) {
                        return val ? val : '0.00';
                    }
                });
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

                let _data = await this.$api.get('teacher/money/list', this.queryData);
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
                let _res = await this.$api.post("teacher/money", postData);
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
             * @returns {Promise<void>}
             * @param row
             */
            async saveUpdate(row) {
                let _tip;
                if (row.id) {
                    _tip = '修改';
                } else {
                    _tip = '新增';
                }
                this.saveAction(row, _tip);
            },
            async saveAction(postData, _tip = "操作") {
                let _post = await this.$api.post('teacher/money', postData);
                if (_post.code === 200) {
                    this.showAddBox = false;
                    this.$message.success(_tip + '成功');
                    this.getData()
                } else {
                    this.$message.error(_post.msg);
                }
            },
            showEABox(row = null) {
                console.log(row);
                if (row) {
                    this.tmpRow = row;
                    this.editTitle = '编辑信息';
                    this.submitText = '确认修改';
                } else {
                    this.tmpRow = {name: ''};
                    this.editTitle = '新增薪资';
                    this.submitText = '提交';
                }
                this.showAddBox = true;
            },
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
