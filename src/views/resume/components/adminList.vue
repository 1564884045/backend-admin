<template>
  <div style="height: 100%">
    <form-builder class="flex justify-end mb-10" :fields="searchFields" :inline="true"
                  submit-name="查询" @onSubmit="search"/>

    <table-builder @pageChange="pageChange" :table-data="tableData" :cols="colsData" :total="total">
      <el-table-column label="管理员角色">
        <template slot-scope="{row}">
          <el-select
              @change="roleChange($event,row)"
              v-model="row.roleId"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="roleList"
              :loading="searchRoleLoading">
            <el-option
                v-for="item in roleListArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>


      <el-table-column label="账号状态">
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

      <el-table-column label="操作" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" plain size="mini" @click="showEABox(row)">修改</el-button>
          <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </table-builder>

    <el-dialog :visible.sync="showAddBox" :title="editTitle" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" label-width="90px">
        <el-form-item label="账号">
          <el-input v-model="tmpRow.account" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="tmpRow.password" placeholder="请输入登录密码"/>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="tmpRow.phone" placeholder="请输入联系电话"/>
        </el-form-item>

        <el-form-item>
          <el-button @click="showAddBox = false">取消</el-button>
          <el-button type="primary" @click="saveUpdate">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<!--


{
	// 店铺基本角色
	EDIT_PRODUCT: "EDIT_PRODUCT", // 新增、编辑产品
	EDIT_ORDER: "EDIT_ORDER", // 修改订单信息
	EDIT_SHOP_INFO: "EDIT_SHOP_INFO", // 编辑店铺信息
	EDIT_COUPON: "EDIT_COUPON", // 新增、修改优惠券信息
	EDIT_CUSTOMER: "EDIT_CUSTOMER", // 编辑客户信息
	EDIT_SHOP_ADMIN: "EDIT_SHOP_ADMIN", // 编辑店员

	LOOK_DEAL_DATA: "LOOK_DEAL_DATA", // 查看交易数据
	LOOK_PRODUCT: "LOOK_PRODUCT", // 查看店铺商品后台
	LOOK_ORDER: "LOOK_ORDER", // 查看店铺订单
	LOOK_SHOP_INFO: "LOOK_SHOP_INFO", // 查看店铺信息
	LOOK_REPORT: "LOOK_REPORT", // 查看经营数据
	LOOK_COUPON: "LOOK_COUPON", // 查看优惠券
	LOOK_SHOP_ADMIN: "LOOK_SHOP_ADMIN", // 查看店铺店员
	LOOK_CUSTOMER: "LOOK_CUSTOMER", // 查看客户信息
}
-->

<script>

export default {
  name: 'adminList',
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
        {prop: 'account', label: '账号', sortable: false, fixed: false},
        {prop: 'phone', label: '电话', sortable: false, fixed: false},
        {prop: 'nickname', label: '昵称', sortable: false, fixed: false},
      ],
      // 搜索表单字段
      searchFields: [
        {label: '管理员', prop: 'searchKey', type: 'text'},
      ],
      // 查询数据
      queryData: {},
      // 自定义扩展字段
      statusArr: [
        {value: 2, label: '暂停使用'},
        {value: 1, label: '正常使用'},
        {value: 0, label: '禁止登录'},
      ],
      // 页面显示数据
      showAddBox: false,
      uploadUrl: this.$api.uploadUrl,

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
  methods: {
    //父组件打开
    init(companyId) {
      if (companyId) this.companyId = companyId;
      else return this.$baseMessage("查找参数丢失", 400)
      this.getData();
      this.roleList("");
    },
    /**
     * 本页获取数据
     */
    async getData() {
      this.queryData.companyId = this.companyId;
      this.queryData.page = this.page;
      this.queryData.pageSize = this.pageSize;
      console.log(this.queryData);
      await this.$api.get('admin/list', this.queryData).then(_data => {
        console.log(_data);
        if (_data.code === 200) {
          this.tableData = _data.data.list;
          this.total = _data.data.total
        }
      })
    },
    roleList(e) {
      this.searchRoleLoading = true;
      this.$api.get("admin/role/list", {
        searchKey: e,
        companyId: this.companyId,
        page: 1,
        pageSize: 10
      }).then((res) => {
        setTimeout(() => {
          this.searchRoleLoading = false;
        }, 800);

        if (res.code === 200) this.roleListArr = res.data.list;
      })
    },
    /**
     * 修改角色
     */
    async roleChange(e, row) {
      console.log(e)
      let postData = {
        roleId: e
      };
      if (row.id) postData.id = row.id;
      if (!e) return;
      this.saveAction(postData);
    },
    /**
     * 修改状态
     */
    async statusChange(e, row) {
      let postData = {
        status: e
      };
      if (row.id) postData.id = row.id;
      this.saveAction(postData);
    },
    saveAction(postData) {
      this.$api.post("admin", postData).then(_res => {
        if (_res.code !== 200) {
          this.$message.error(_res.msg);
          this.getData();
        }
      })
    },

    // 监听页面改变
    pageChange(e) {
      this.page = e.page;
      this.pageSize = e.pageSize;
      this.getData();
    },
    search(e) {
      this.queryData = e;
      this.getData()
    },
    /**
     * 新增和修改
     * @param e
     * @returns {Promise<void>}
     */
    saveUpdate() {
      let postData = {
        companyId: this.companyId,
        account: this.tmpRow.account,
        password: this.tmpRow.password,
        phone: this.tmpRow.phone,
      };
      if (this.tmpRow.id) postData.id = this.tmpRow.id;
      this.$api.post('admin', postData).then(_post => {
        if (_post.code === 200) {
          this.showAddBox = false;
          this.$message.success(_post.msg);
          this.getData()
        } else {
          this.$message.error(_post.msg);
        }
      })

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
        this.$api.del('/admin/' + row.id).then(_del => {
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
