<template>
  <div style="max-width: 1000px;margin: auto">
    <!--    店铺基本信息    -->
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>店铺基础信息设置</span>
      </div>
      <el-form :model="info" :rules="rules" ref="productInfoForm" label-width="180px"
               size="small">
        <el-form-item label="企业：" prop="name">
          <el-input v-model="info.name"/>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="info.address"/>
        </el-form-item>
        <el-form-item label="详细地址：" prop="street">
          <el-input v-model="info.street"/>
        </el-form-item>
        <el-form-item label="法人：" prop="legalPerson">
          <el-input v-model="info.legalPerson" type="text" placeholder="法人"/>
        </el-form-item>
        <el-form-item label="信用代码：" prop="legalPerson">
          <el-input v-model="info.creditCode" type="text" placeholder="信用代码"/>
        </el-form-item>
        <el-form-item label="咨询电话：" prop="phone">
          <el-input v-model="info.phone" type="text" placeholder="可选"/>
        </el-form-item>
        <el-form-item label="简介：" prop="intro">
          <el-input
              :autoSize="true"
              v-model="info.intro"
              type="textarea"
              placeholder="请输入内容"/>
        </el-form-item>


        <el-form-item style="text-align: center" label-width="0">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "config",

  data() {
    return {
      isUse: true,
      isUseText: '已启用',
      info: {
        name: '',
        address: '',
        street: '',
        legalPerson: '',
        creditCode: '',
        phone: '',
        mpAppId: '',
        mpAppSecret: '',
        mchId: '',
        mchApiKey: '',
        cover: '',
        logo: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        address: [{required: true, message: '请输入加地址', trigger: 'blur'}],
        legalPerson: [{required: true, message: '请输入法人/负责人', trigger: 'blur'}],
      }
    }
  },
  created() {
    this.$get("company").then(res=>{
        if (res.code === 200) {
          this.info = res.data;
        }
    }).catch(err=>{
      this.$message.error("网络请求失败");
    });
  },
  methods: {
    save() {
      // 更新数据
      this.$api.post("company", this.info).then(ret => {
        if (ret.code === 200) {
          this.$message.success("保存成功")
        }
      })

    },
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
