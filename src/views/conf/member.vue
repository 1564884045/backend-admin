<template>
  <div style="max-width: 1000px;margin: auto">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺会员配置</span>
      </div>
      <el-form ref="form" :model="conf" label-width="160px">
        <el-form-item label="开启会员" prop="member">
          <el-switch v-model="conf.member"></el-switch>
        </el-form-item>
        <el-form-item label="会员单价" prop="memberPrice" v-if="conf.member">
          <el-input type="number" v-model="conf.memberPrice" placeholder="请输入会员价格（开通会员的价格，单位：元）"></el-input>
        </el-form-item>

        <el-form-item label="会员时长" prop="memberTimer" v-if="conf.member">
          <el-input type="number" v-model="conf.memberTimer" placeholder="开通会员的时长（会员单价开通的会员时长，单位：天）"></el-input>
        </el-form-item>
        <!--      开通满减  -->
        <el-card class="box-card" v-if="conf.member">
          <div slot="header" class="clearfix">
            <el-form-item label="会员开通满减" prop="discount" style="margin: 0">
              <el-switch v-model="conf.discount"></el-switch>
              <span style="font-size: 12px; padding: 0 10px;color: #4d4d4d">设置开通长时间会员时的折扣金额</span>
              <el-button v-if="conf.discount" type="primary" size="mini" round @click="addDiscountItem">添加</el-button>
            </el-form-item>
          </div>
          <div v-if="conf.discount">
            <el-form-item v-for="(item,index) in conf.discountArr" :key="index"
                          label-width="90px" :label="'折扣'+ (index + 1) + ':'">
              <el-row>
                <el-col :span="10">
                  <el-input type="number" v-model="item.amount" placeholder="开通数量，如开通3个月，则输入3">
                    <template slot="prepend">开通数量</template>
                  </el-input>
                </el-col>
                <el-col :span="10">
                  <el-input type="number" v-model="item.price" placeholder="折扣价格，单位：元">
                    <template slot="prepend">折扣价格</template>
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <div class="align-center">
                    <el-button size="mini" round @click="delDiscountItem(index)" type="danger">删除</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
              </el-row>
            </el-form-item>
          </div>
        </el-card>

        <!--    START 开通会员权益    -->
        <el-card class="box-card" v-if="conf.member">
          <div slot="header" class="clearfix">
            <el-form-item label="开通/续费会员礼包" prop="memberGifts" style="margin: 0">
              <el-switch v-model="conf.memberGifts"></el-switch>
              <span style="font-size: 12px; padding: 0 10px;color: #4d4d4d">开通和续费时给客户的礼包（优惠券）</span>
            </el-form-item>
          </div>
          <el-form-item label="礼包内容" prop="product" v-if="conf.memberGifts">
            <div>
              <el-col style=" margin:5px" v-show="0<conf.memberGiftsArr.length" :span="5" class="goods-image"
                      v-for="(product,index) in conf.memberGiftsArr"
                      :key="index">
                <div style="text-align: center">
                  <el-image class="item-p" :src="baseUrl + product.cover"/>
                  <div class="ellipsis-1" style="display: flex;justify-content: center">
                    {{ product.title }}
                  </div>
                  <div style="display: flex;justify-content: center">
                    <i class="el-icon-circle-close del-icon" style="cursor: pointer"
                       @click="delCoupon(index,conf.memberGiftsArr)"/>
                  </div>
                </div>
              </el-col>
            </div>
            <el-col :span="5" class="goods-image">
              <i class="el-icon-plus avatar-uploader-icon item-p" @click="getCoupons('memberGifts')"/>
            </el-col>
          </el-form-item>
        </el-card>
        <!--    END 开通会员权益    -->

        <!--    会员权益    -->
        <el-card class="box-card" v-if="conf.member">
          <div slot="header" class="clearfix">
            <span>会员权益</span>
          </div>
          <el-form-item label="消费折扣" prop="orderDiscount">
            <div>
              <el-radio-group v-model="conf.orderDiscount">
                <el-radio label="">无折扣</el-radio>
                <el-radio label="allOrder">每单折扣</el-radio>
                <el-radio label="firstOrder">首单折扣</el-radio>
              </el-radio-group>
            </div>
            <div style="font-size: 12px;color: #a2a2a2;line-height: 14px">
              注：每单折扣表示购买的所有订单在结算时均享受折扣；首单折扣表示在一定时间内的第一笔订单享受该折扣
            </div>
          </el-form-item>

          <el-form-item label="折扣周期" prop="firstOrder" v-if="conf.orderDiscount === 'firstOrder'">
            <el-radio-group v-model="conf.firstOrder">
              <el-radio label="everyWeek">每周首单</el-radio>
              <el-radio label="everyMonth">每月首单</el-radio>
              <el-radio label="onlyOne">仅开通会员后首单</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="折扣比例" prop="orderDiscountNum" v-if="conf.orderDiscount">
            <el-input type="number" :max="10" :min="1" v-model="conf.orderDiscountNum"
                      placeholder="付款金额打折比例；列如：输入7表示7折"></el-input>
          </el-form-item>
          <!--周期礼包-->
          <el-form-item label="周期礼包" prop="firstOrder">
            <div>
              <el-radio-group v-model="conf.cycleGifts">
                <el-radio label="">无礼包</el-radio>
                <el-radio label="everyWeek">每周礼包</el-radio>
                <el-radio label="everyMonth">每月礼包</el-radio>
              </el-radio-group>
            </div>
            <div style="font-size: 12px;color: #a2a2a2;line-height: 14px">
              注：周期礼包会在开通之后每个周期发放
            </div>
          </el-form-item>
          <el-form-item label="周期礼包内容" prop="product" v-if="conf.cycleGifts">
            <div>
              <el-col style=" margin:5px" v-show="0<conf.cycleGiftsArr.length" :span="5" class="goods-image"
                      v-for="(product,index) in conf.cycleGiftsArr"
                      :key="index">
                <div style="text-align: center">
                  <el-image class="item-p" :src="baseUrl + product.cover"/>
                  <div class="ellipsis-1" style="display: flex;justify-content: center">
                    {{ product.title }}
                  </div>
                  <div style="display: flex;justify-content: center">
                    <i class="el-icon-circle-close del-icon" style="cursor: pointer"
                       @click="delCoupon(index,conf.cycleGiftsArr)"/>
                  </div>
                </div>
              </el-col>
            </div>
            <el-col :span="5" class="goods-image">
              <i class="el-icon-plus avatar-uploader-icon item-p" @click="getCoupons('cycleGifts')"/>
            </el-col>
          </el-form-item>
        </el-card>
        <!--    END 会员权益    -->
        <!--        会员协议 -->
        <el-card class="box-card" v-if="conf.member">
          <div slot="header" class="clearfix">
            <span>会员协议</span>
          </div>
          <quill-editor :header="header" v-model="conf.xy"/>
        </el-card>

        <el-form-item>
          <el-button type="primary" @click="save">立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
        width="30%"
        title="选择开通会员礼包"
        :visible.sync="showCouponList">
      <div>
        <el-button style="margin: 10px 0" type="primary" size="mini" @click="okCoupon">确定</el-button>
      </div>
      <table-builder show-selection :cols="couponCols" :table-data="couponList" @pageChange="couponPageChange"
                     :total="couponTotal" @selectionChange="selectCouponChange"/>
    </el-dialog>
  </div>
</template>

<script>
import QuillEditor from "@/components/Quill"

export default {
  name: "config",
  components: {
    QuillEditor
  },
  data() {
    return {
      header: this.$api.header(),
      baseUrl: this.$api.baseUrl,
      showCouponList: false,
      couponTotal: 0,
      couponPage: 1,
      couponPageSize: 10,
      couponList: [],
      selectedCouponIds: [],
      selectedCouponList: [],
      couponType: '',
      couponCols: [
        {prop: 'title', label: '优惠券标题', sortable: false, fixed: false},
        {prop: 'intro', label: '简介', sortable: false, fixed: false},
        {prop: 'reduce', label: '减免金额', sortable: false, fixed: false},
      ],

      conf: {
        member: false,
        memberGifts: false,
        memberGiftsArr: [],

        discount: false,
        discountArr: [{
          amount: '',
          price: ''
        }],

        memberPrice: '',
        memberTimer: '',
        orderDiscount: '', // 订单折扣
        orderDiscountNum: '',
        firstOrder: '',

        cycleGifts: '',
        cycleGiftsArr: [],

        xy: ''

      },

      rules1: {
        sysLabel: [{required: true, message: '请输入称谓', trigger: 'blur'},],
        sysPhone: [{required: true, message: '请输入联系电话', trigger: 'blur'},],
        appId: [{required: true, message: '请输入appId', trigger: 'blur'},],
        appSecret: [{required: true, message: '请输入appSecret', trigger: 'blur'}],
        mchid: [{required: true, message: '请输入mchid', trigger: 'blur'}],
        redirectIp: [{required: true, message: '请输入redirectIp', trigger: 'blur'}],
        modelId: [{required: true, message: '请输入modelId', trigger: 'blur'}],
        sigName: [{required: true, message: '请输入sigName', trigger: 'blur'}],
        appKey: [{required: true, message: '请输入appKey', trigger: 'blur'}],
      },
    }
  },
  created() {
    this.$api.get("company/conf").then(res => {
      if (res.code === 200 && res.data.config) {
        this.conf = JSON.parse(res.data.member)
      }
    })

  },
  methods: {
    selectCouponChange(e) {
      console.log(e);
      this.tmpSelectList = e;
    },
    //获取分类的
    getCoupons(type) {
      this.couponType = type;
      let _ids = [];
      if (this.couponType === 'memberGifts') {
        this.conf.memberGiftsArr.forEach(item => {
          _ids.push(item.id)
        });
      }
      if (this.couponType === 'cycleGifts') {
        this.conf.cycleGiftsArr.forEach(item => {
          _ids.push(item.id)
        });
      }

      this.selectedCouponIds = _ids;

      let loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let postData = {
        page: this.couponPage,
        pageSize: this.couponPageSize,
      };

      this.$api.get("coupon/list", postData).then(res => {
        if (res.code === 200) {
          this.couponList = res.data.list;
          this.couponTotal = res.data.total;
          this.showCouponList = true;
        }
        loading.close()
      }).catch(err => {
        loading.close()
      })
    },
    couponPageChange(e) {
      this.couponPage = e.page
      this.couponPageSize = e.pageSize
      this.getProducts();
    },
    okCoupon() {
      let _list = [];
      if (this.couponType === 'memberGifts') {
        _list = this.conf.memberGiftsArr || [];
      }
      if (this.couponType === 'cycleGifts') {
        _list = this.conf.cycleGiftsArr || [];
      }

      let _add = this.tmpSelectList.filter(p => {
        return this.selectedCouponIds.indexOf(p.id) === -1;
      });

      _add.forEach(i => {
        _list.push({
          id: i.id,
          cover: i.cover,
          title: i.title
        });
      });

      if (this.couponType === 'memberGifts') {
        this.conf.memberGiftsArr = _list;
      }

      if (this.couponType === 'cycleGifts') {
        this.conf.cycleGiftsArr = _list;
      }
      this.showCouponList = false;
      this.tmpSelectList = [];
    },
    delCoupon(i, that) {
      that.splice(i, 1);
    },

    save() {
      let postData = {
        member: JSON.stringify(this.conf)
      }
      // 更新数据
      this.$api.post("company/conf", postData).then(ret => {
        if (ret.code === 200) {
          this.$message.success("保存成功")
        }
      })

    },
    submitSysServiceConf() {
      this.$refs['sysConf'].validate((valid) => {
        if (valid) {
          this.$api.post("saveConf", this.sysConf).then(ret => {
            if (ret.code === 200)
              this.$message.success(ret.msg);
            else
              this.$message.error(ret.msg);
          })
        } else {
          return false;
        }
      });
    },
    delDiscountItem(index) {
      this.conf.discountArr.splice(index, 1)
    },
    addDiscountItem() {
      this.conf.discountArr.push({
        amount: '',
        price: ''
      })
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 10px;
}

.el-input {
  margin-bottom: 0px;
}

.el-button {
  float: right;
  margin: 0 10% 10px;
}

>>> .el-card__body {
  padding: 20px 100px 20px 60px;
}

.avatar-uploader-icon {
  line-height: 120px;
  font-size: 20px;
  color: #cecece;
  border: 1px dashed #cecece;
  border-radius: 8px;
  text-align: center;
}

.item-p {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.goods-image {
  display: flex;
  justify-content: center;
}
</style>
