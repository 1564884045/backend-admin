<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" size="small">
      <el-form-item label="封面展示：">
        <image-upload :action="this.$api.baseUrl + '/upload/cover'" field="cover" v-model="value"/>
      </el-form-item>
      <el-form-item label="logo：">
        <image-upload :action="this.$api.baseUrl + '/upload/logo'" field="logo" v-model="value"/>
      </el-form-item>
      <el-form-item label="图册 (可选)：">
        <el-col :span="24">
          <images-upload :max="6" :action="this.$api.baseUrl + '/upload/banner'" field="banner" v-model="value"/>
        </el-col>
      </el-form-item>
      <el-form-item prop="house_direction" label="标签：">
        <el-tag :key="tIndex" style="margin-right: 5px"
                v-for="(tag,tIndex) in keywordsArr"
                closable
                :disable-transitions="false"
                @close="closeKeyWord(tag,tIndex)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" style="width: 100px;"
                  v-if="keywordsInputVisible"
                  v-model="keywordsInputValue"
                  :autofocus="true"
                  auto
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="keywordsInputConfirm"
                  @blur="keywordsInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="addTag">+ 添加标签</el-button>
      </el-form-item>

      <el-form-item style="text-align: center" label-width="0">
        <el-button size="mini" @click="handlePrev" v-if="!onlyOne">上一步，填写基本信息</el-button>
        <el-button type="primary" size="mini" @click="handleNext" v-if="!onlyOne">下一步，填写图文详情</el-button>
        <el-button type="primary" size="mini" @click="save" v-if="onlyOne">保存</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "step2",
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
        keywordsArr: [],
        keywordsInputVisible: false,
        keywordsInputValue: "",
      }
    },
    watch: {
      value: function (val) {
        if (val) {
          if (val.tags) this.keywordsArr = val.tags;
          else this.keywordsArr = [];
        }
      },
    },
    methods: {
      handlePrev() {
        this.$emit('prevStep');
      },
      handleNext() {
        this.value.tags = this.keywordsArr;
        if (!this.value.banner) this.value.banner = [];
        this.$emit('nextStep')
      },
      save() {
        this.value.tags = this.keywordsArr;
        if (!this.value.banner) this.value.banner = [];
        this.$emit('nextStep','end');
      },
      closeKeyWord(tag, i) {
        this.keywordsArr.splice(i, 1);
      },
      addTag() {
        this.keywordsInputVisible = true;
      },
      keywordsInputConfirm() {
        if (this.keywordsInputValue) {
          this.keywordsArr.push(this.keywordsInputValue);
        }
        this.keywordsInputVisible = false;
        this.keywordsInputValue = '';
      },

    }
  }
</script>

<style scoped>

</style>
