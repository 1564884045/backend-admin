<template>
    <div style="height: 100%">
        <div class="flex ptb-10 align-center">
            <div class="w-50 flex justify-start"></div>
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
            <el-table-column label="会员状态">
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

            <el-table-column label="查看实名" v-if="this.$hasConf('config', 'realName')">
                <template slot-scope="{row}">
                    <el-button type="primary" plain size="mini" @click="showRealName(row)">查看实名信息</el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button type="primary" plain size="mini" @click="showEABox(row)">修改</el-button>
                    <el-button type="warning" plain size="mini" @click="address(row)">地址列表</el-button>
                    <el-button type="success" plain size="mini" @click="im(row)">消息</el-button>
                    <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
                </template>
            </el-table-column>
        </table-builder>

        <!--  弹窗 //新增 编辑 -->
        <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false">

        </el-dialog>
        <el-dialog :visible.sync="showSalesmanBox" title="指派销售" :close-on-click-modal="false">
            <form-builder style="padding: 10px;background-color: #f9f9f9;border-radius: 5px" :fields="searchSalesFields"
                          :inline="true"
                          submit-name="搜索" @onSubmit="searchSales"/>
            <table-builder single-choice :cols="salesmanCols" :table-data="salesmanList" :show-pagination="false"
                           @clickCurrent="selectSalesChange"/>
        </el-dialog>

        <el-dialog :visible.sync="showAddressBox" title="客户地址" :close-on-click-modal="false">
            <address-list :user-id="tmpRow.id" v-if="showAddressBox"/>
        </el-dialog>


        <!--回复消息框-->
        <el-dialog class="chat-box" :visible.sync="showImBox" title="对话框" :close-on-click-modal="false">
            <chat-box :nickname="tmpRow.name" :avatar="tmpRow.avatar" :user-id="tmpRow.id" v-if="showImBox"/>
        </el-dialog>
    </div>
</template>

<script>
import chatBox from './components/chatBox'
import AddressList from "@/views/user/components/addressList";

export default {
    name: 'userList',
    components: {AddressList, chatBox},
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
                {prop: 'name', label: '姓名', sortable: false, fixed: false},
                {prop: 'nickname', label: '昵称', sortable: false, fixed: false},
                {prop: 'phone', label: '电话', sortable: false, fixed: false},
                // {
                //     prop: 'gender', label: '性别', sortable: false, fixed: false, pipe: function (val) {
                //         let gender = '未知';
                //         if (val === 1) gender = '男';
                //         if (val === 2) gender = '女';
                //         return gender;
                //     }
                // },
                {
                    prop: 'totalPayMoney', label: '总消费金额(元)', align: 'center', sortable: false, fixed: false,
                    pipe: function (val) {
                        return val ? val : '0.00';
                    }
                },

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

            showSalesmanBox: false,
            searchSalesFields: [
                {label: '搜索', prop: 'searchKey', type: 'text'},
            ],
            salesmanCols: [
                {prop: 'name', label: '姓名', sortable: false, fixed: false},
                {prop: 'phone', label: '电话', sortable: false, fixed: false},
                {prop: 'roleText', label: '角色', sortable: false, fixed: false},
            ],
            salesmanList: [],
            querySalesData: {},


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

            let _data = await this.$api.get('user/list', this.queryData);
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
            let _res = await this.$api.post("user", postData);
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
            if (e.id) {
                _tip = '修改';
            } else {
                _tip = '新增';
            }
            let _post = await this.$api.post('user', e);
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
                this.editTitle = '编辑信息';
                this.submitText = '确认修改';
            } else {
                this.tmpRow = {name: '', parentId: 0, level: 1};
                this.editTitle = '新增课程';
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
                this.$api.del('/user/' + row.id).then(_del => {
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
