<template>
  <el-select @change="change"
             @focus="atClick"
             filterable
             remote
             auto-complete="new-password"
             reserve-keyword
             :remote-method="remoteMethod"
             :loading="loading" v-model="v" :placeholder="placeholder">
    <el-option
        v-for="(item,index) in list"
        :key="index"
        :label="item[showLabel]"
        :value="item.id">
      <span v-if="!selfTemplate">{{ item[showLabel] }}</span>
      <span v-else> <slot :item="item"/></span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "remoteSelect",
  props: {
    value: Object,
    /**
     * 选中值时绑定到value中的属性名
     */
    field: {
      type: String,
      default: "id",
    },
    selfTemplate: {
      type: Boolean,
      default: false,
    },
    /**
     * 值变化时value中的属性值名数组
     */
    bindFields: {
      type: Array,
      default: function () {
        return []
      }
    },
    /**
     * 展示的获取到的列表里的值
     */
    showLabel: {
      type: String,
      default: "name",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    /**
     * 远程地址
     */
    api: {
      type: String,
      default: "",
      require: true
    },
    /**
     * 默认值
     */
    defaultValue: {
      type: null,
      default: "",
    },
    /**
     * 初始化组件时是否就直接自动加载
     */
    autoLoad: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      v: '',
      list: [],
      loading: false
    }
  },
  watch: {
    defaultValue: function (val) {
      console.log(val);
      if (val) {
        this.v = val
      } else {
        this.v = ""
      }
    }
  },
  mounted() {
    if (this.autoLoad) this.remoteMethod("");
  },
  methods: {
    atClick() {
      if (this.list.length === 0) this.remoteMethod("");
    },
    async remoteMethod(e) {
      // console.log(e);
      this.loading = true;
      this.$api.get(this.api, {
        searchKey: e,
        page: 1,
        pageSize: 30
      }).then((res) => {
        setTimeout(() => {
          this.loading = false;
        }, 400);

        if (res.code === 200) this.list = res.data.list;
      })
    },
    change(e) {
      this.$emit("change", e);
      this.value[this.field] = this.v;
      this.changeObj();
    },
    changeObj() {
      let obj = null;
      this.list.forEach(item => {
        if (this.v === item.id){
            obj = item;
            // console.log(obj);
          this.bindFields.map(i => {
            if (item[i]){ this.value[i] = item[i];}
            // console.log(this.value)
          })
        }
      });
      this.$emit("changeObj", obj);
    }
  }
}
</script>Z
