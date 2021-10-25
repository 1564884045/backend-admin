<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" size="small">
      <el-form-item label="选择地址：">
        <div class="amap-page-container" style="width: 100%;height: 360px;border: #d2d1d6 solid 1px">
          <el-amap vid="amapDemo" name="amapDemo"
                   @click="mapClick" :events="events"
                   :zoom="zoom" :center="center" class="amap-demo">
            <el-amap-marker v-if="showMarker" :position="marker.position"
                            :events="marker.events"
                            :visible="marker.visible"
                            :icon="marker.icon" :draggable="marker.draggable"/>
          </el-amap>
        </div>
      </el-form-item>

      <el-form-item style="text-align: center;" label-width="0">
        <el-button size="mini" @click="handlePrev" v-if="!onlyOne">上一步，填写基本信息</el-button>
        <el-button type="primary" size="mini" @click="handleNext" v-if="!onlyOne">选好了，提交</el-button>
        <el-button type="primary" size="mini" @click="save" v-if="onlyOne">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "step3",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }, onlyOne: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        header: this.$api.header(),
        zoom: 10,
        center: [106.684296, 26.622242],
        marker: {
          position: [106.684296, 26.622242],
          events: {
            click: () => {
              // alert('click marker');
            },
            dragend: (e) => {
              console.log('---event---: dragend', e)
              this.marker.position = [e.lnglat.lng, e.lnglat.lat];
            }
          },
          visible: true,
          draggable: true,
          template: '<span>1</span>',
        },
        showMarker: false,
        events: {
          'moveend': () => {
          },
          'zoomchange': () => {
          },
          'click': (e) => {
            console.log('map clicked', e);
            this.showMarker = true;
            this.marker.position = [e.lnglat.lng, e.lnglat.lat]
            this.lat = e.lnglat.lat;
            this.lng = e.lnglat.lng;
          }
        },
        searchOption: {
          city: '贵阳'
        },
        lat: 0,
        lng: 0
      }
    },
    created() {

    },
    computed: {},
    watch: {
      value: function (val) {
        if (val) {
          if (val.lng && val.lat) {
            this.lng = val.lng;
            this.lat = val.lat;
            this.marker.position = [val.lng, val.lat];
            this.showMarker = true;
          } else {
            this.lng = 0;
            this.lat = 0;
            this.marker.position = [106.684296, 26.622242];
            this.showMarker = false;
          }

        }
      },
    },
    methods: {
      mapClick(e) {
        console.log(e)
      },
      handlePrev() {
        this.$emit('prevStep');
      },
      handleNext() {
        if (!this.lat || !this.lng) return this.$message.warning("请选择所在地址定位");
        this.value.lng = this.lng;
        this.value.lat = this.lat;

        this.$emit('nextStep', 'end')
      },
      save() {
        if (!this.lat || !this.lng) return this.$message.warning("请选择所在地址定位");
        this.value.lng = this.lng;
        this.value.lat = this.lat;
        this.$emit('nextStep','end');
      },
      closeKeyWord(tag) {
        this.keywordsArr.splice(this.keywordsArr.indexOf(tag), 1);
      },
      keywordsInputConfirm() {
        if (this.keywordsInputValue) {
          this.keywordsArr.push(this.keywordsInputValue);
        }
        this.keywordsInputVisible = false;
        this.keywordsInputValue = '';
      },

      onSearchResult(e) {
        console.log(e)
      }

    }
  }
</script>

<style scoped>
  /deep/ .el-upload-dragger {
    width: 280px;
    height: 120px;
  }

  /deep/ .el-icon-upload {
    margin: 0;
  }

  .avatar-uploader-icon {
    line-height: 120px;
    font-size: 20px;
    color: #cecece;
    border: 1px dashed #cecece;
    border-radius: 8px;
  }
</style>
