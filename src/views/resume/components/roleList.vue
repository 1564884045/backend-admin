<template>
  <div style="height: 100%">
    <form-builder class="flex justify-end mb-10" :fields="searchFields" :inline="true"
                  submit-name="查询" @onSubmit="search"/>

    <table-builder @pageChange="pageChange" :table-data="tableData" :cols="colsData" :total="total">
      <el-table-column label="角色权限">
        <template slot-scope="{row}">
          <div>
            {{ row | permissionText }}
          </div>
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
        <el-form-item label="角色名">
          <el-input v-model="tmpRow.name" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="权限列表">
          <el-transfer :titles="['未获得权限','已获得权限']" v-model="permissions" :data="permissionsArr"/>
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
import Vue from 'vue';

const permissionArr = [
  {key: "EDIT_PRODUCT", label: "新增、编辑产品"},
  {key: "EDIT_ORDER", label: "修改订单信息"},
  {key: "EDIT_SHOP_INFO", label: "编辑店铺信息"},
  // {key: "EDIT_ACTIVITY", label: "新增、修改活动/优惠券信息"},
  {key: "EDIT_CUSTOMER", label: "编辑客户信息"},
  {key: "EDIT_SHOP_ADMIN", label: "新增、编辑店员"},
  // {key: "EDIT_SHOP_SALESMAN", label: "销售管理"},
  // {key: "EDIT_HOME", label: "编辑首页数据"},
  // {key: "EDIT_SHOPS", label: "新增、编辑店铺"},
  // {key: "EDIT_SYS", label: "系统管理"},

  {key: "LOOK_DEAL_DATA", label: "查看交易数据"},
  {key: "LOOK_PRODUCT", label: "查看店铺商品"},
  // {key: "LOOK_PRODUCT_CATEGORY", label: "修改商品分类"},
  {key: "LOOK_ORDER", label: "查看店铺订单"},
  {key: "LOOK_SHOP_INFO", label: "查看店铺信息"},
  {key: "LOOK_REPORT", label: "查看经营数据"},
  // {key: "LOOK_COUPON", label: "查看优惠券"},
  {key: "LOOK_SHOP_ADMIN", label: "查看店铺店员"},
  {key: "LOOK_CUSTOMER", label: "查看客户信息"},
];

Vue.filter("permissionText", function (row) {
  let _arr = [];
  permissionArr.forEach((item) => {
    if (row.permissions.indexOf(item.key) > -1) _arr.push(item.label)
  });
  return _arr.join(",")
});
export default {
  name: 'roleList',
  data() {
    return {
      companyId: '',
      // 分页数据
      page: 1,//默认显示第几页
      pageSize: 20,//默认显示多少条每页
      total: 0, // 总记录数
      // 页面结构数据
      tableData: [],
      // 表格字段
      colsData: [
        {prop: 'name', label: '角色名', sortable: false, fixed: false, width: 120},
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

      permissionsArr: permissionArr,
      permissions: []
    }
  },
  methods: {
    //父组件打开
    init(companyId) {
      if (companyId) this.companyId = companyId;
      else return this.$baseMessage("查找参数丢失", 400)

      this.companyId = companyId;
      this.getData();
    },
    /**
     * 本页获取数据
     */
    async getData() {
      this.queryData.companyId = this.companyId;
      this.queryData.page = this.page;
      this.queryData.pageSize = this.pageSize;
      this.$api.get('admin/role/list', this.queryData).then(_data => {
        console.log(_data);
        if (_data.code === 200) {
          this.tableData = _data.data.list;
          this.total = _data.data.total
        }
      })
    },
    // 监听页面改变
    pageChange(e) {
      this.page = e.page;
      this.pageSize = e.pageSize;
      console.log(e);
      this.getData();
    },
    search(e) {
      console.log(e);
      this.queryData = e;
      this.getData()
    },
    /**
     * 新增和修改
     * @returns {Promise<void>}
     */
    saveUpdate() {
      let postData = {
        name: this.tmpRow.name,
        id: this.tmpRow.id,
        companyId: this.companyId,
        permissions: this.permissions.join(",")
      };
      this.saveAction(postData)
    },

    saveAction(saveData) {
      this.$api.post('admin/role', saveData).then(_post => {
        if (_post.code === 200) {
          this.showAddBox = false;
          this.$message.success(_post.msg);
          this.getData()
        } else {
          this.$message.error(_post.msg);
        }
      })
    },
    /**
     * 显示
     * @param row
     */
    showEABox(row = null) {
      console.log(row);
      if (row) {
        this.tmpRow = row;
        this.editTitle = '编辑角色';
        this.submitText = '确认修改';
        this.permissions = row.permissions.split(",");
      } else {
        this.tmpRow = {name: '', parentId: 0, level: 1};
        this.editTitle = '新增角色';
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
        this.$api.del('/admin/role/' + row.id).then(_del => {
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

</style>
