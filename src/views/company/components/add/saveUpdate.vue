<template>
  <el-dialog :visible.sync="visible"
             :title="title"
             :close-on-click-modal="false"
             @close="close" destroy-on-close>
    <el-card class="form-container" shadow="never">
      <el-steps :active="step -1" finish-status="success" align-center>
        <el-step title="填写基本信息"/>
        <el-step title="上传图片"/>
        <el-step title="选择地址"/>
      </el-steps>
      <step1
        v-show="step === 1"
        v-model="param"
        :is-edit="visible"
        :only-one="onlyOne"
        @nextStep="nextStep">
      </step1>
      <step2
        v-show="step === 2"
        v-model="param"
        :is-edit="visible"
        :only-one="onlyOne"
        @nextStep="nextStep"
        @prevStep="prevStep">
      </step2>
      <step3
        v-show="step === 3"
        v-model="param"
        :is-edit="visible"
        :only-one="onlyOne"
        @nextStep="nextStep"
        @prevStep="prevStep">
      </step3>
    </el-card>
  </el-dialog>
</template>
<script>
  import step1 from './step1';
  import step2 from './step2';
  import step3 from './step3';
  // import step4 from './step4';
  /**
   * @method ok
   */
  export default {
    name: 'saveUpdate',
    components: {step1, step2, step3},
    props: {},
    data() {
      return {
        visible: false,
        param: {},
        step: 1,
        onlyOne: false,
        title: ''
      }
    },
    watch: {},
    methods: {
      async getDetail(id) {
        console.log(id);
        let detail = await this.$api.get("company/" + id);
        if (detail.code === 200) {
          let _data = detail.data;

          _data.banner = detail.data.banner ? detail.data.banner.split(",") : [];
          _data.tags = detail.data.tags ? detail.data.tags.split(",") : [];

          this.param = _data;
          let o = "asda";
        } else {
          this.$message.error(detail.msg)
        }
      },
      refreshData() {
        this.param = {};
        this.step = 1;
      },

      prevStep() {
        if (this.step > 1) {
          this.step -= 1;
        }

      },
      nextStep(e) {
        console.log(e);
        if (e === 'end') {
          // 组装提交到服务器的数据
          let saveData = JSON.parse(JSON.stringify(this.param));

          console.log(saveData.banner);
          saveData.banner = saveData.banner.join(",");
          saveData.tags = saveData.tags.join(",");
          if (this.detailId) saveData.id = this.detailId;
          this.$emit("ok", saveData);

          return;
        }
        this.step += 1;
      },
      open(row = null, title = '', step = '') {
        if (row && row.id) {
          this.detailId = row.id;
          this.getDetail(this.detailId);
          if (title)
            this.title = title;
          else
            this.title = '修改'
        } else {
          if (title)
            this.title = title;
          else
            this.title = '新增'
        }
        if (step) {
          this.step = step;
          this.onlyOne = true;
        }
        this.visible = true;

      },
      close() {
        this.visible = false;
      }
    }
  }
</script>
<style>

</style>


