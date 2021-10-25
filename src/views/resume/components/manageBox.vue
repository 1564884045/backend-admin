<template>
  <el-drawer
      :title="detail.name"
      :visible.sync="show"
      :direction="direction"
      :before-close="handleClose"
      size="45%">
    <div class="p-10">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>企业角色</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="addRole">添加角色</el-button>
        </div>
        <role-list ref="roleList"/>
      </el-card>

      <el-card class="box-card mtb-10">
        <div slot="header" class="clearfix">
          <span>企业管理员</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="addAdmin">添加管理员账号</el-button>
        </div>
        <admin-list ref="adminList"/>
      </el-card>
    </div>
  </el-drawer>
</template>

<script>
import RoleList from "@/views/company/components/roleList";
import AdminList from "@/views/company/components/adminList";

export default {
  name: "manageBox",
  components: {AdminList, RoleList},
  data() {
    return {
      show: false,
      direction: 'rtl',
      detailId: '',
      detail: {}
    }
  },
  methods: {
    getData() {
      this.$get('company/' + this.detailId).then(res => {
        if (res.code === 200) {
          this.detail = res.data;
          this.$refs.roleList.init(this.detailId);
          this.$refs.adminList.init(this.detailId);
        }
      })
    },
    open(row) {
      console.log(row);
      this.detailId = row.id;
      this.getData();
      this.show = true;
    },
    close() {
      this.show = false;
    },
    handleClose() {
      this.close();
      this.$emit('close')
    },
    addRole() {
      this.$refs.roleList.showEABox();
    },
    addAdmin() {
      this.$refs.adminList.showEABox();
    }
  }

}
</script>

<style scoped>

</style>
