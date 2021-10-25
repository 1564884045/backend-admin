<template>
    <div style="max-width: 1000px;margin: auto">
        <el-card class="box-card">
            <div slot="header" class="clearfix"><span>首页广告入口</span>
            </div>
            <el-form ref="form" :model="conf" label-width="180px">
                <el-form-item label="启用首页广告">
                    <el-switch
                            @change="confChange"
                            v-model="conf.homeAd"
                            active-text="开启"
                            inactive-text="关闭">
                    </el-switch>
                </el-form-item>
            </el-form>
        </el-card>
        <div v-if="conf.homeAd">
            <!--    广告配置    -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px">广告1位</span>
                </div>
                <div>
                    <table-builder :cols="adCols" :table-data="ad1Data" :show-pagination="false">
                        <template slot="tableHeader">
                            <el-button type="primary" size="mini" plain style="margin: 10px"
                                       @click="showEABox(null,'ad1')">
                                添加广告
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
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px">广告2位</span>
                </div>
                <div>
                    <table-builder :cols="adCols" :table-data="ad2Data" :show-pagination="false">
                        <template slot="tableHeader">
                            <el-button type="primary" size="mini" plain style="margin: 10px"
                                       @click="showEABox(null,'ad2')">
                                添加广告
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
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px">广告3位</span>
                </div>
                <div>
                    <table-builder :cols="adCols" :table-data="ad3Data" :show-pagination="false">
                        <template slot="tableHeader">
                            <el-button type="primary" size="mini" plain style="margin: 10px"
                                       @click="showEABox(null,'ad3')">
                                添加广告
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
                </div>
            </el-card>
        </div>

        <!--  弹窗 //新增 编辑 -->
        <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false">
            <el-form v-if="showAddBox" ref="form" :rules="rules" :model="tmpRow" label-width="150px">
                <el-form-item label="跳转方式" prop="toType">
                    <el-radio-group v-model="tmpRow.toType" @change="refreshTmpRow">
                        <el-radio label="product">产品详情</el-radio>
                        <el-radio label="productCategory">产品分类</el-radio>
                        <el-radio label="course">课程详情</el-radio>
                        <el-radio label="gradeCourseCategory">义务教育课程分类</el-radio>
                        <el-radio label="artCourseCategory">艺术课程分类</el-radio>
                        <el-radio label="task">活动</el-radio>
                        <el-radio label="url" disabled>外链</el-radio>
                        <el-radio label="article" disabled>文章</el-radio>
                        <el-radio label="notice" disabled>公告</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转商品" prop="target" v-show="tmpRow.toType === 'product'">
                    <remote-select api="product/list" show-label="title" v-model="tmpRow" field="target"
                                   :bind-fields="['cover','title']"
                                   v-if="tmpRow.toType === 'product'"/>
                </el-form-item>
                <el-form-item label="跳转商品分类" prop="target" v-show="tmpRow.toType === 'productCategory'">
                    <remote-select api="product/category/list" show-label="name" v-model="tmpRow" field="target"
                                   :bind-fields="['name']"
                                   v-if="tmpRow.toType === 'productCategory'"/>
                </el-form-item>
                <el-form-item label="跳转课程" prop="target" v-show="tmpRow.toType === 'course'">
                    <remote-select api="course/list" show-label="title" field="target" v-model="tmpRow"
                                   :bind-fields="['cover','title']"
                                   v-if="tmpRow.toType === 'course'"/>
                </el-form-item>
                <el-form-item label="跳转分类" prop="target" v-show="tmpRow.toType === 'gradeCourseCategory'">
                    <remote-select api="course/category/list?type=grade" show-label="name" field="target"
                                   v-model="tmpRow"
                                   :bind-fields="['name']"
                                   v-if="tmpRow.toType === 'gradeCourseCategory'"/>
                </el-form-item>
                <el-form-item label="跳转分类" prop="target" v-show="tmpRow.toType === 'artCourseCategory'">
                    <remote-select api="course/category/list?type=art" show-label="name" field="target" v-model="tmpRow"
                                   :bind-fields="['name']"
                                   v-if="tmpRow.toType === 'artCourseCategory'"/>
                </el-form-item>
                <el-form-item label="跳转活动" prop="target" v-show="tmpRow.toType === 'task'">
                    <remote-select api="task/list" show-label="title" field="target" v-model="tmpRow"
                                   :bind-fields="['cover','title']"
                                   v-if="tmpRow.toType === 'task'"/>
                </el-form-item>

                <el-form-item label="标题" prop="title">
                    <el-input v-model="tmpRow.title"/>
                </el-form-item>

                <el-form-item label="封面" prop="cover" v-show="tmpRow.toType && tmpRow.toType !== ''">
                    <image-upload v-model="tmpRow" :action="baseUrl + '/upload/home/ad'" field="cover"/>
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
                conf: {
                    appId: '',
                    homeAd: false
                },
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

                ad1Data: [],
                ad2Data: [],
                ad3Data: [],

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
            this.$api.get("company/conf").then(res => {
                if (res.code === 200) {
                    this.conf = JSON.parse(res.data.config) || {};
                }
            })
        },
        methods: {
            getData() {
                this.$api.get("company/home/list", {position: 'ad1'}).then(res => {
                    if (res.code === 200) {
                        this.ad1Data = res.data.list;
                    }
                });
                this.$api.get("company/home/list", {position: 'ad2'}).then(res => {
                    if (res.code === 200) {
                        this.ad2Data = res.data.list;
                    }
                });
                this.$api.get("company/home/list", {position: 'ad3'}).then(res => {
                    if (res.code === 200) {
                        this.ad3Data = res.data.list;
                    }
                })
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
            confChange() {
                let postData = {
                    config: JSON.stringify(this.conf)
                };
                this.$api.post("company/conf", postData).then(ret => {
                    if (ret.code === 200) {
                        this.$message.success("保存成功")
                    }
                })
            }

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
