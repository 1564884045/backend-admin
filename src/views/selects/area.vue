<template>
    <div style="height: 100%;max-width: 900px;margin: 0 auto">

        <div class="flex ptb-10 align-center">
            <div class="w-50">
                <el-button icon="el-icon-plus" type="primary" @click="showEABox(null,'add')">
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

        <el-row :gutter="20">
            <el-col :span="24">
                <el-tree
                    :data="tableData"
                    lazy
                    :load="loadChild"
                    node-key="id"
                    label="name">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ data.name }}</span>
                        <div>
                            <el-select style="margin-right: 10px" size="mini" v-model="data.status" placeholder="请选择"
                                       @change="statusChange($event,data)">
                                <el-option
                                    v-for="item in showArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button v-if="data.level === 2" type="warning" size="mini"
                                       @click.stop="() => setHot(data)">
                                {{data.hot ? '取消热门' : '设为热门'}}
                            </el-button>

                            <el-button v-if="data.level < 3" type="success" size="mini"
                                       @click.stop="() => showEABox(data,'add')">
                                添加
                            </el-button>
                            <el-button type="primary" size="mini" @click.stop="() => showEABox(data,'edit')">
                                修改
                            </el-button>
                            <el-button type="danger" size="mini" @click.stop="() => del(data)">
                                删除
                            </el-button>
                        </div>
                    </div>
                </el-tree>
            </el-col>
        </el-row>

        <!--  弹窗 //新增 编辑 -->
        <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false">
            <el-form v-if="showAddBox" ref="form" :model="tmpRow" label-width="100px">
                <el-form-item label="添加方式" prop="name">
                    <el-radio-group v-model="addType">
                        <el-radio label="auto">选择城市（可多选）</el-radio>
                        <el-radio label="custom">自定义（补充添加）</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="addType === 'auto'" label="城市" prop="name">
                    <el-cascader placeholder="请选择城市（可多选）" class="w-100" :props="cityOptions"
                                 v-model="addObj.ids"></el-cascader>
                </el-form-item>
                <el-form-item v-if="addType === 'custom'" label="城市" prop="name">
                    <el-input v-model="tmpRow.name" placeholder="请输入城市名称"/>
                </el-form-item>
                <el-form-item label="简介（可选）" prop="intro">
                    <el-input type="textarea" v-model="addObj.intro"/>
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

    const showType = {
        home_show: '首页展示',
        category_show: '商城页展示',
    };

    let id = 1000;
    export default {
        name: 'areaList',
        data() {
            return {
                // 页面结构数据
                tableData: [],
                // 搜索表单字段
                searchFields: [
                    {label: '分类', prop: 'name', type: 'text'},
                ],
                // 查询数据
                queryData: {
                    name: '',
                },
                // 自定义扩展字段
                showArr: [
                    {value: 1, label: '显示'},
                    {value: 0, label: '不显示'},
                ],

                // 页面显示数据
                showAddBox: false,
                uploadUrl: this.$api.uploadUrl,
                addType: 'auto',
                openType: '',

                imageUrl: '',
                tmpRow: { // 查看、添加的临时变量
                    id: '',
                    pid: '',
                    name: '',
                    type: '',
                    status: 1,
                    level: 1
                },
                editTitle: '添加',
                submitText: '确认添加',
                cityOptions: {
                    lazy: true,
                    multiple: true,
                    label: 'name',
                    value: 'id',
                    lazyLoad: (node, resolve) => {
                        this.loadAllChild(node, resolve);
                    }
                },
                addObj: {
                    ids: [],
                    intro: ''
                }
            }
        },
        created() {
            // this.getData();
            // 获取供应商

        },
        methods: {
            /**
             * 本页获取数据
             */
            async getData() {
                this.queryData.pid = 0;
                this.queryData.level = 1;

                this.$api.get('area/used/list', this.queryData).then(_data => {
                    console.log(_data);
                    if (_data.code === 200) {
                        let _list = _data.data.list;
                        _list.map(i => {
                            i.leaf = i.level >= 2
                        });
                        this.tableData = _list;
                        this.total = _data.data.total
                    }
                })

            },
            /**
             * 加载下一级
             */
            loadChild(node, resolve) {
                let row = node.data;
                if (3 > node.level > 0) {
                    let query = {
                        pid: row.id,
                        level: 1 + node.level
                    };
                    this.$get('area/used/list', query).then(res => {
                        if (res.code === 200) {
                            let _list = res.data.list;
                            console.log("_list", _list);
                            _list.map(i => {
                                i.leaf = !(i.level >= 3)
                            });
                            resolve(_list)
                        } else {
                            resolve([])
                        }
                    }).catch(err => {
                        resolve([])
                    })
                }
            },
            /**
             * 选择框加载更多
             */
            loadAllChild(node, resolve) {
                let row = node.data;
                console.log(node);
                console.log('this.tmpRow', this.tmpRow);
                let query = {
                    pid: this.tmpRow.id,
                    level: this.tmpRow.level + 1
                };
                if (node.level > 0) {
                    query = {
                        pid: row.id,
                        level: this.tmpRow.level + node.level
                    };
                }
                if (query.level > 3) return resolve([]);
                this.$get('area/list', query).then(res => {
                    if (res.code === 200) {
                        let _list = res.data.list;
                        _list.map(i => {
                            i.leaf = i.level >= 3
                        })
                        resolve(_list)
                    } else {
                        resolve([])
                    }
                }).catch(err => {
                    resolve([])
                })
            },
            setHot(data) {
                let postData = {
                    id: data.id,
                    hot: !data.hot,
                }
                this.saveAction(postData);
            },
            async statusChange(e, row) {
                let postData = {
                    id: row.id,
                    status: e
                };

                console.log(e);
                console.log(row);
                let _res = await this.$api.post("area/used", postData);

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
            search(e) {
                console.log(e);
                this.page = 1;
                this.getData()
            },
            /**
             * 新增和修改
             * @param e
             * @returns {Promise<void>}
             */
            async saveUpdate() {
                let loading = this.$baseLoading("提交中...");
                if (this.addType !== 'auto') {
                    let postData = {};
                    // 编辑
                    if (this.openType === 'edit') {
                        postData = {
                            id: this.tmpRow.id,
                            name: this.tmpRow.name
                        }
                    } else {
                        postData = {
                            pid: this.tmpRow.id,
                            level: this.tmpRow.level + 1,
                            name: this.tmpRow.name
                        }
                    }
                    await this.saveAction(postData);
                    loading.close();
                    return
                }
                console.log(this.addObj);
                let _ids = [];
                this.addObj.ids.forEach(i => {
                    // 添加父级
                    _ids.push(i[0]);
                    _ids.push(i[1]);
                    _ids.push(i[2]);
                });

                _ids = unique(_ids);
                let ids = _ids.join(",");
                this.$post("area/used/addAll", ids).then(res => {
                    loading.close();
                    if (res.code === 200) {
                        this.$message.success('添加成功');
                        this.showAddBox = false;
                        this.getData();
                    }
                }).catch(err => {
                    loading.close();
                    this.$baseMessage("网络请求失败", 400);

                })
            },

            saveAction(postData, tip = '操作') {
                this.$api.post("area/used", postData).then(res => {
                    if (res.code === 200) {
                        this.$message.success(tip + '成功');
                        if (!postData.id) {
                            let newChild = res.data;
                            newChild.children = [];
                            if (!this.tmpRow.children) {
                                this.$set(this.tmpRow, 'children', []);
                            }
                            this.tmpRow.children.push(newChild);
                        }
                        this.showAddBox = false;
                        this.getData();
                    } else {
                        this.$message.warning(res.msg)
                    }
                })
            },

            showEABox(row, openType) {
                console.log(row);
                this.openType = openType;
                if (row && openType === 'edit') {
                    this.tmpRow = row;
                    this.editTitle = '编辑信息';
                    this.submitText = '确认修改';
                } else {
                    let _newRow = {name: '', pid: 0, id: 0, level: 1};
                    if (row) {
                        _newRow.pid = row.id;
                        _newRow.level = row.level + 1;
                    }
                    this.tmpRow = _newRow;
                    this.editTitle = '新增分类';
                    this.submitText = '提交';
                }

                this.showAddBox = true;
            },

            del(row) {
                console.log(row);
                this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.del('area/' + row.id).then(_del => {
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
            },

            append(data) {
                const newChild = {id: id++, label: 'testtest', children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },

            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },


        }
    }

    /**
     * 去重
     * @param arr
     * @returns {[]}
     */
    function unique(arr) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        var array = [];
        for (var i = 0; i < arr.length; i++) {
            if (array.indexOf(arr[i]) === -1) {
                array.push(arr[i])
            }
        }
        return array;
    }
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    /deep/ .el-tree-node__content {
        height: 50px;
    }
</style>
