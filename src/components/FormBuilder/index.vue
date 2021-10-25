<template>
  <el-form :inline="inline" :ref="formName" :model="formObj" :label-width="labelWidth" :rules="a_rules">
    <div class="el-form-item" v-for="(field,index) in u_fields" :key="index">
      <!--    输入 || 文本域       -->
      <el-form-item :label="field.label" :prop="field.prop"
                    v-if="!field.type || field.type === 'text' || field.type === 'textarea' || field.type === 'number'">
        <el-input :type="field.type" v-model="formObj[field.prop]"
                  :placeholder="field.placeholder"/>
      </el-form-item>
      <!--     END  输入 || 文本域       -->

      <!--     选择框       -->
      <el-form-item :label="field.label" v-else-if="field.type === 'select'" :prop="field.prop">
        <el-select v-model="formObj[field.prop]" :placeholder="field.placeholder">
          <el-option v-for="(option,o_index) in field.options" :key="o_index"
                     :label="option.label" :value="option.value"/>
        </el-select>
      </el-form-item>
      <!--    END 选择框       -->

      <!--  时间日期 -->
      <el-form-item :label="field.label" v-else-if="field.type === 'date'">
        <el-date-picker :placeholder="field.placeholder" :value-format="field.format || 'yyyy-MM-dd HH:mm:ss'"
                        v-model="formObj[field.prop]"
                        style="max-width: 200px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item  :label="field.label" v-else-if="field.type === 'time'">
        <el-time-picker v-model="formObj[field.prop]" value-format="HH:ii:ss"
                        :placeholder="field.placeholder"
                        style="max-width: 200px;">
        </el-time-picker>
      </el-form-item>
      <!--  END 时间日期  -->

      <!--      开关       -->
      <el-form-item :label="field.label" v-else-if="field.type === 'switch'" :prop="field.prop">
        <el-switch v-model="formObj[field.prop]"/>
      </el-form-item>
      <!--     END 开关       -->
      <!--多选框-->
      <el-form-item :label="field.label" v-else-if="field.type === 'checkbox'" :prop="field.prop">
        <el-checkbox-group v-model="formObj[field.prop]">
          <el-checkbox v-for="(box,box_index) in field.options" :key="box_index" :name="field.prop"
                       v-model="formObj[field.prop][box.key]" :label="box.key">{{box.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!--END多选框-->

      <!--     单选框       -->
      <el-form-item :label="field.label" v-else-if="field.type === 'radio'" :prop="field.prop">
        <el-radio-group v-model="formObj[field.prop]">
          <el-radio v-for="(radio,radio_index) in field.options"
                    :key="radio_index"
                    :label="radio.key">{{radio.label}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!--     END 单选框       -->
    </div>
    <!--    其他自定义输入    -->
    <slot/>
    <el-form-item>
      <el-button size="small" type="primary" @keyup.enter="onSubmit(formName)" @click="onSubmit(formName)">
        {{submitName}}
      </el-button>
    </el-form-item>
    <slot name="btn"/>
  </el-form>
</template>

<script>
  export default {
    name: 'FormBuilder',
    props: {
      labelWidth: {
        type: String,
        default: '100px'
      },
      /**
       * 是否一行显示
       */
      inline: {
        type: Boolean,
        default: false
      },
      /**
       * 获取字段的链接
       */
      formName: {
        type: String,
        default: function() {
          return ''
        }
      },
      /**
       * 表单名称
       */
      name: {
        type: String,
        default: ''
      },
      /**
       *
       */
      submitName: {
        type: String,
        default: '立即提交'
      },

      /**
       * 录入字段
       */
      fields: {
        type: Array,
        default: function() {
          return []
        }
      },
      /**
       * 验证规则
       */
      rules: {
        type: Array,
        default: function() {
          return []
        }
      },
      /**
       * 是否需要从网络加载
       */
      webForm: {
        type: Boolean,
        default: function() {
          return false
        }
      },
      defaultValue: {
        type: Object,
        default: function() {
          return null
        }
      }

    },
    data() {
      return {
        p_rules: [],
        u_fields: [],
        a_rules: {}, // 验证规则
        formObj: {} // 生成的表单对象
      }
    },
    async created() {
      if (!this.webForm) {
        this.u_fields = this.fields
        this.calcObj()
        return
      }

      if (!this.formName) return
      // TODO 线上获取表单
      let _table = await this.$api.get('getFormFields', { form: this.formName })
      console.log(_table)
      if (_table.code === 200) {
        let _fields = _table.data
        // 结合本地的字段
        if (this.fields.length > 0) {
          _fields = _fields.concat(this.fields)
        }
        console.log(_fields)
        return this.u_fields = _fields
      }
      return this.u_fields = []

    },

    watch: {
      u_fields: (val) => {
        console.log('12341241', val)

      }
    },
    methods: {
      onSubmit(formName) {
        console.log(formName)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('onSubmit', this.formObj)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      calcObj() {
        let _tmpRule = {},
                _tmpForm = {}
        this.u_fields.forEach(field => {
          let _tmp = []
          // 判断是否带有rule
          if (field.rules) _tmp = [...field.rules]
          let hasRequireRule = false
          _tmp.forEach(_r => {
            if (_r['required']) {
              hasRequireRule = true
            }
          })
          // 表单对象
          _tmpForm[field.prop] = ''
          // 没有自带的判断，并且为必须
          if (!hasRequireRule && field.required) {
            let message = '', trigger = 'blur', required = true, type = ''
            switch (field.type) {
              case 'text':
              case 'textarea':
                message = '请输入' + field.label
                break
              case 'select':
                message = '请选择' + field.label
                trigger = 'change'
                break

              case 'date':
                message = '请选择' + field.label
                trigger = 'change'
                break
              case 'time':
                message = '请选择' + field.label
                trigger = 'change'
                break
              case 'radio':
                message = '请至选择' + field.label
                trigger = 'change'
                break

              case 'checkbox':
                message = '请至少选择一项' + field.label
                trigger = 'change'
                type = 'array'
                break
            }
            if (field.trigger) trigger = field.trigger
            // 如果是时间选择则不在这里添加验证
            if (field.type !== 'datePicker') _tmp.push({ required, message, trigger, type })
          }
          if (field.type !== 'datePicker') _tmpRule[field.prop] = _tmp

        })

        this.a_rules = _tmpRule
        if (this.defaultValue != null) {
          this.formObj = this.defaultValue
        } else {
          this.formObj = _tmpForm
        }
      }
    }
  }
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
