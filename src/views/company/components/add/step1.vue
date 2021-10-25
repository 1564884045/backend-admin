<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="110px"
             size="small">
      <el-form-item label="企业名称：" prop="name">
        <el-input v-model="value.name" placeholder="企业名称"/>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="value.address" placeholder="地址"/>
      </el-form-item>
<!--      <el-form-item label="详细地址：" prop="street">-->
<!--        <el-input v-model="value.street" placeholder="详细地址"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="负责人（法人）：" prop="legalPerson">-->
<!--        <el-input v-model="value.legalPerson" type="text" placeholder="负责人（法人）"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="信用代码：" prop="creditCode">-->
<!--        <el-input v-model="value.creditCode" type="text" placeholder="信用代码"/>-->
<!--      </el-form-item>-->
      <el-form-item label="咨询电话：" prop="phone">
        <el-input v-model="value.phone" type="text" placeholder="可选"/>
      </el-form-item>
      <!--            <el-form-item label="排序">-->
      <!--                <el-input v-model="value.sort" type="number"/>-->
      <!--            </el-form-item>-->
      <el-form-item label="简介：" prop="intro">
        <el-input
          :autoSize="true"
          v-model="value.intro"
          type="textarea"
          placeholder="请输入内容"/>
      </el-form-item>

      <el-form-item style="text-align: center" label-width="0">
        <el-button type="primary" size="mini" @click="handleNext" v-if="!onlyOne">下一步，图片信息</el-button>
        <el-button type="primary" size="mini" @click="save" v-if="onlyOne">保存</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "step1",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      },
      onlyOne: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          address: [{required: true, message: '请输入地址', trigger: 'blur'}],
          // legalPerson: [{required: true, message: '请输入法人/负责人', trigger: 'blur'}],
        },
        dueDateTime: false,
        dueDate: ''
      };
    },
    watch: {
      value: function (newValue) {
        this.dueDate = newValue.dueDate;
        this.dueDateTime = (newValue.dueDate === 'unLimit')
      }
    },
    methods: {
      dueDateChange(e) {
        console.log(e);
        if (e === true) this.value.dueDate = 'unLimit';
        else if (e !== true && e !== false) this.value.dueDate = e;
        else this.value.dueDate = this.dueDate;
      },
      handleNext() {
        console.log(this.value);
        this.$refs['productInfoForm'].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            return false;
          }
        });
      },
      save() {
        this.$refs['productInfoForm'].validate((valid) => {
          if (valid) {
            this.$emit('nextStep','end');
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
</style>
