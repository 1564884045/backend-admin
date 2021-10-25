<template>
  <div style="height: 100%;">
    <!--    表格顶部    -->
    <slot name="tableHeader"/>

    <!--    //表格顶部    -->

    <!--  表格主体  -->
    <el-table
      :data="tableData" border
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"

      @selection-change="handleSelectionChange"
      :highlight-current-row="singleChoice"
      @current-change="clickCurrentRow"
      ref="tableBuilder"
      style="width: 100%">
      <el-table-column v-if="showSelection" type="selection" width="39"/>

      <el-table-column v-for="(col,index) in columns" :key="index" :sortable="col.sortable"
                       :prop="col.prop"
                       :label="col.label"
                       :fixed="col.fixed"
                       :width="col.width">
        <template slot-scope="{row,$index}">
          <div v-if="col.canEdit === true">
            <div v-if="editField ==='edit_'+col.prop+'_'+$index">
              <el-input :type="col.editType || 'text'" v-model="row[col.prop]" class="edit-input"
                        size="small"
                        @blur="blur(row,col.prop)">
                <i slot="suffix" @click="cancelEdit(row)" class="el-input__icon el-icon-close"/>
              </el-input>
            </div>
            <div v-else class="col-custom" style="height: 50px;width: 100%"
                 @dblclick="dblclick(row,'edit_'+col.prop+'_'+$index,row[col.prop])">
              {{ col.pipe ? col.pipe(row[col.prop]) : row[col.prop] }}
            </div>
          </div>
          <div v-else class="col-custom" style="height: 50px;width: 100%" @click="tap(row)">
            <div v-if="col.type === 'img'" class="col-img">
              <el-image style="width: 50px; height: 50px" :src="(col.pipe ? col.pipe(row[col.prop]) : row[col.prop])"
                        fit="cover" :preview-src-list="[(col.pipe ? col.pipe(row[col.prop]) : row[col.prop])]"/>
            </div>
            <div v-else>{{ col.pipe ? col.pipe(row[col.prop]) : row[col.prop] }}</div>
          </div>
        </template>
      </el-table-column>
      <slot/>
    </el-table>
    <!-- // 表格主体   -->
    <!--分页数据-->
    <div class="block" style="margin-top: 10px;" v-if="showPagination">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     @prev-click="prePageData"
                     @next-click="nextPageData"
                     :current-page.sync="currentPage"
                     :page-sizes="[10, 20, 50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'TableBuilder',
    props: {
      /**
       * 显示多选
       */
      showSelection: {
        type: Boolean,
        default: false
      },

      /**
       * 单选
       */
      singleChoice: {
        type: Boolean,
        default: false
      },
      /**
       * 表格名，用于请求后端获取渲染数据
       */
      tableName: {
        type: String,
        default: function () {
          return ''
        }
      },
      /**
       * 如果没有获取链接，使用本地传入也行
       */
      cols: {
        type: Array,
        default: function () {
          return []
        }
      },
      /**
       * 显示的数据
       */
      tableData: {
        type: Array,
        default: function () {
          return []
        }
      },
      total: {
        type: Number,
        default: 0
      },
      showPagination: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      }

    },
    data() {
      return {
        editField: '',
        tmpOld: '', // 旧值
        columns: [],
        table_data: [],
        currentPage: 1,//当前显示页
        pageSize: 10,//当前分页 每页数据条数

        currentRow: null,

      }
    },
    async created() {
      if (this.cols.length > 0) {
        this.columns = this.cols
      } else if (this.tableName) {
        // 网络加载列
        let _table = await this.$api.get('getTableCols', {table: this.tableName})
        console.log(_table)
        if (_table.code === 200) {
          this.columns = _table.data
        } else {
          this.columns = []
        }
        console.log(this.tableName)
      }
    },
    methods: {
      tap(row) {
        console.log(123);
        this.$emit('click', row)
      },
      dblclick(row, id, old) {
        this.editField = id;
        this.tmpOld = old;
        console.log('双击', row, this.editField);

        this.$emit('colDblclick', row)
      },
      // 保存
      blur(row, field) {
        console.log(field, this.tmpOld)
        console.log('失焦', row, this.editField)
        this.editField = '';
        // 新旧不等才提交
        if (row[field] !== this.tmpOld) {
          this.$emit('colBlur', {row, field, old: this.tmpOld})
        }
      },
      cancelEdit(row) {
        this.editField = '';
        this.$emit('cancelEdit', row)
      },
      handleSelectionChange(val) {
        this.$emit('selectionChange', val)
      },

      handleSizeChange(val) {//每页数据条数
        this.pageSize = val;
        this.currentPage = 1;
        this.$emit('pageChange', {
          pageSize: this.pageSize,
          page: this.currentPage
        })
      },
      handleCurrentChange(val) {//点击或跳转val页
        this.currentPage = val;
        this.$emit('pageChange', {
          pageSize: this.pageSize,
          page: this.currentPage
        })
      },
      prePageData() {//上一页
        this.currentPage -= 1;
        this.$emit('pageChange', {
          pageSize: this.pageSize,
          page: this.currentPage
        })
      },
      nextPageData() {//下一页
        this.currentPage += 1;
        this.$emit('pageChange', {
          pageSize: this.pageSize,
          page: this.currentPage
        })
      },
      clickCurrentRow(row) {
        if (this.singleChoice) {
          this.$refs.tableBuilder.setCurrentRow(row);
          this.$emit('clickCurrent', row)
        }
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-pagination {
    white-space: pre-wrap;
  }

  .col-img {
    display: flex;
    width: 100%;
    justify-content: center;
    align-content: center;
  }
</style>
