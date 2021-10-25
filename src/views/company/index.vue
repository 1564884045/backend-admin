<template>
    <div class="roleManagement-container">
        <div class="flex ptb-10 align-center">
            <div class="w-50 flex justify-start">
                <el-button class="mlr-10" icon="el-icon-plus" type="primary" @click="handleEdit">
                    添加
                </el-button>
            </div>

            <div class="w-50 flex justify-end">
                <el-form class="align-center flex" :inline="true" :model="queryForm" @submit.native.prevent>
                    <el-input class="mlr-10"
                              v-model.trim="queryForm.searchKey"
                              placeholder="请输入查询条件"
                              clearable
                    />
                    <el-button icon="el-icon-search" type="primary" @click="queryData">
                        查询
                    </el-button>
                </el-form>
            </div>
        </div>


        <table-builder
            v-loading="listLoading"
            :element-loading-text="elementLoadingText"
            :table-data="list" :cols="colsData" :total="total">
            <el-table-column label="状态">
                <template slot-scope="{row}">
                    <el-select v-model="row.status" placeholder="请选择" @change="statusChange($event,row)">
                        <el-option
                            v-for="item in statusArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="240">
                <template #default="{ row }">
                    <el-dropdown>
                        <el-button size="mini" type="success">
                            编辑
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <div @click="handleEdit(row,'修改基本信息',1)">基本信息</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="handleEdit(row,'修改图片信息',2)">图片信息</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="handleEdit(row,'修改位置信息',3)">位置信息</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button class="ml-10" size="mini" type="primary" @click="manageRow(row)">企业管理</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </table-builder>
        <!--    新增或修改弹窗-->
        <save-update ref="edit" @ok="saveUpdate"></save-update>
        <!--    管理抽屉-->
        <manage-box ref="manageBox"/>
    </div>
</template>

<script>
import saveUpdate from './components/add/saveUpdate'
import ManageBox from "@/views/company/components/manageBox";

export default {
    name: 'shopList',
    components: {ManageBox, saveUpdate},
    data() {
        return {
            list: [],
            colsData: [
                {prop: 'name', label: '名称', sortable: false, fixed: false},
                {prop: 'intro', label: '简介', sortable: false, fixed: false},
                {prop: 'phone', label: '联系电话', sortable: false, fixed: false},
                {prop: 'address', label: '所在地', sortable: false, fixed: false},
            ],
            // 自定义扩展字段
            statusArr: [
                {value: 3, label: '待审核'},
                {value: 2, label: '暂停营业'},
                {value: 1, label: '正常营业'},
                {value: 0, label: '禁用'},
            ],
            total: 0,
            selectRows: '',
            listLoading: true,
            elementLoadingText: '正在加载...',
            queryForm: {
                page: 1,
                pageSize: 10,
                searchKey: '',
            },
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            this.listLoading = true;
            let res = await this.$get('company/list', this.queryForm)
            this.list = res.data.list;
            this.total = res.data.total;
            setTimeout(() => {
                this.listLoading = false
            }, 300)
        },
        manageRow(row) {
            this.$refs.manageBox.open(row);
        },
        setSelectRows(val) {
            this.selectRows = val
        },
        saveUpdate(e) {
            console.log(e);
            this.saveAction(e);
        },
        statusChange(e, row) {
            let postData = {
                id: row.id,
                status: e
            };
            this.saveAction(postData)
        },
        /**
         * 保存方法
         * @param postData
         */
        saveAction(postData) {
            this.$post('company', postData)
                .then(res => {
                    if (res.code === 200) {
                        this.$refs['edit'].close();
                        this.fetchData()
                    }
                    this.$baseMessage(res.msg, res.code)
                }).catch(err => {
                this.$baseMessage(err.msg, 500)
            })
        },
        handleEdit(row = null, title = null, step = null) {
            if (row && row.id) {
                this.$refs['edit'].open(row, title, step)
            } else {
                this.$refs['edit'].open()
            }
        },
        handleDelete(row) {
            if (row.id) {
                this.$baseConfirm('你确定要删除当前项吗', null, async () => {
                    const {msg} = await this.$api.del('company/' + row.id);
                    this.$baseMessage(msg, 'success');
                    this.fetchData()
                })
            } else {
                if (this.selectRows.length > 0) {
                    const ids = this.selectRows.map((item) => item.id).join()
                    this.$baseConfirm('你确定要删除选中项吗', null, async () => {
                        const {msg} = await this.$api.del('company/' + ids)
                        this.$baseMessage(msg, 'success');
                        this.fetchData()
                    })
                } else {
                    this.$baseMessage('未选中任何行', 'warn');
                    return false
                }
            }
        },
        queryData() {
            this.queryForm.page = 1;
            this.fetchData()
        },
    },
}
</script>
