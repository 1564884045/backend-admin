<template>
  <div style="height: 100%">
    <form-builder style="padding: 10px;background-color: #f9f9f9;border-radius: 5px" :fields="searchFields"
                  :inline="true"
                  submit-name="搜索" @onSubmit="search"/>

    <table-builder :table-data="tableData" :cols="colsData" :total="total">
      <template slot="tableHeader">
        <el-button type="default" size="mini" plain style="margin: 10px" @click="exportExcel">导出表格</el-button>
      </template>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" plain size="mini" @click="showEABox(row)">修改</el-button>
          <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </table-builder>

    <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" label-width="90px">
        <el-form-item label="账号">
          <el-input v-model="tmpRow.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="tmpRow.password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="tmpRow.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="showAddBox = false">取消</el-button>
          <el-button type="primary" @click="saveUpdate">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'addressList',
  props: {
    userId: {
      type: String,
      default: ""
    }
  },
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
        {prop: 'name', label: '联系人', sortable: false, fixed: false},
        {prop: 'phone', label: '电话', sortable: false, fixed: false},
        {
          prop: 'gender', label: '性别', sortable: false, fixed: false, pipe: function (val) {
            return val === 1 ? '男' : '女'
          }
        },
        {prop: 'address', label: '地址', sortable: false, fixed: false},
        {prop: 'detail', label: '详细位置', sortable: false, fixed: false},
      ],
      // 搜索表单字段
      searchFields: [
        {label: '搜索', prop: 'searchKey', type: 'text'},
      ],
      // 查询数据
      queryData: {},

      // 页面显示数据
      showAddBox: false,

      imageUrl: '',
      tmpRow: { // 查看、添加的临时变量
        id: ''
      },
      editTitle: '添加',
      submitText: '确认添加',

      searchRoleLoading: false,
      roleListArr: []
    }
  },
  created() {
    this.getData();
    // 获取供应商
  },
  methods: {
    /**
     * 本页获取数据
     */
    async getData() {
      this.queryData.userId = this.userId;

      this.queryData.page = this.page;
      this.queryData.pageSize = this.pageSize;

      console.log(this.queryData);

      let _data = await this.$api.get('user/address/list', this.queryData);
      console.log(_data);
      if (_data.code === 200) {
        this.tableData = _data.data.list;
        this.total = _data.data.total
      }
    },
    /**
     * 修改角色
     */
    async roleChange(e, row) {
      let postData = {
        roleId: e
      };
      if (row.id) postData.id = row.id;

      console.log(e);
      console.log(row);
      let _res = await this.$api.post("user/address", postData);
      if (_res.code !== 200) {
        this.$message.error(_res.msg);
        this.getData();
      }
    },
    /**
     * 修改状态
     */
    async statusChange(e, row) {
      let postData = {
        status: e
      };
      if (row.id) postData.id = this.tmpRow.id;

      let _res = await this.$api.post("user/address", postData);
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
      let postData = {
        userId: this.userId,
        account: this.tmpRow.account,
        password: this.tmpRow.password,
        phone: this.tmpRow.phone,
      };
      if (this.tmpRow.id) postData.id = this.tmpRow.id;

      let _post = await this.$api.post('user/address', postData);
      if (_post.code === 200) {
        this.showAddBox = false;
        this.$message.success(_post.msg);
        this.getData()
      } else {
        this.$message.error(_post.msg);
      }
    },

    showEABox(row = null) {
      console.log(row);
      if (row) {
        this.tmpRow = row;
        this.tmpRow.password = "";
        this.editTitle = '编辑信息';
        this.submitText = '确认修改';
      } else {
        this.tmpRow = {};
        this.editTitle = '新增管理员';
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
        this.$api.del('user/address/' + row.id).then(_del => {
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
