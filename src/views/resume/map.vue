<template>
  <div style="height: calc(100vh - 100px);width: 100%;">
    <div class="amap-page-container" style="height: 100%;width: 100%;">
      <el-amap vid="amapDemo" name="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
        <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events"
                        :visible="marker.visible" :key="index"
                        :icon="marker.icon" :draggable="marker.draggable" :vid="index">
          <i class="el-icon-s-flag" style="font-size: 36px;color: #ee1d2b"/>
        </el-amap-marker>
      </el-amap>

    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'shopMap',
  data() {
    return {
      count: 1,
      showInfoBox: false,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      searchs: {
        type: "",
        batch: '',
        uuid: '',
      },
      zoom: 10,
      center: [106.684296, 26.622242],
      markers: [],
      tmpRow: [],
      address: [],
      province: "",
      city: "",
      county: '',
      number: 0,
    };
  },
  created() {
    let location = this.$getCache("LOCATION");
    if (location) this.center = [location.lng, location.lat]
    this.getData()
  },

  methods: {
    async getData() {
      let _data = await this.$api.get('company/list', {page: 1, pageSize: 50});
      console.log(_data);
      if (_data.code === 200) {
        let _list = [];
        _data.data.list.forEach(item => {
          _list.push({
            position: [item.lng, item.lat],
            events: {
              click: () => {
                // alert('click marker');
              },
            },
            visible: true,
            draggable: false,
            template: '<span>1</span>',
          })
        });
        this.markers = _list;
      }

    },


  }
};
</script>
